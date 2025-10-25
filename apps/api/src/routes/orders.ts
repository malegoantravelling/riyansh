import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const router = Router()

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_RWufQ0XTi0n1NL',
  key_secret: 'CExnEL5MY2ITzYUs4nonVsvg',
})

// User order routes require authentication
// Admin routes will be handled separately

// Get user's orders
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get all orders (admin)
router.get('/all', async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*), user:users(*)')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get single order
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create Razorpay order (step 1 - before payment)
router.post('/create-razorpay-order', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    const { shipping_address, billing_address, contact_info } = req.body

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)

    if (cartError || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item: any) => sum + item.product.price * item.quantity,
      0
    )

    // Create order in database first (with pending status)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address,
        billing_address,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      return res.status(400).json({ error: orderError.message })
    }

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      product_image: item.product.image_url,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      return res.status(400).json({ error: itemsError.message })
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
      receipt: order.id,
      notes: {
        order_id: order.id,
        user_id: userId,
      },
    })

    // Update order with razorpay_order_id
    await supabase.from('orders').update({ razorpay_order_id: razorpayOrder.id }).eq('id', order.id)

    res.status(201).json({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      key_id: process.env.RAZORPAY_KEY_ID,
      contact_info,
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    res.status(500).json({ error: error.message })
  }
})

// Verify payment and complete order (step 2 - after payment)
router.post('/verify-payment', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (!isAuthentic) {
      return res.status(400).json({ error: 'Invalid payment signature' })
    }

    // Update order status to paid
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id,
        razorpay_signature,
        paid_at: new Date().toISOString(),
      })
      .eq('id', order_id)
      .eq('user_id', userId)
      .select()
      .single()

    if (orderError) {
      return res.status(400).json({ error: orderError.message })
    }

    // Clear cart after successful payment
    await supabase.from('cart_items').delete().eq('user_id', userId)

    res.json({
      success: true,
      order,
      message: 'Payment verified successfully',
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create order (legacy endpoint - kept for backward compatibility)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    const { shipping_address, billing_address, notes } = req.body

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)

    if (cartError || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    // Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item: any) => sum + item.product.price * item.quantity,
      0
    )

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address,
        billing_address,
        notes,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      return res.status(400).json({ error: orderError.message })
    }

    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      product_image: item.product.image_url,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      return res.status(400).json({ error: itemsError.message })
    }

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', userId)

    res.status(201).json(order)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update order status (admin)
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
