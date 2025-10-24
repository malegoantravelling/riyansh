import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// All cart routes require authentication
router.use(authenticateToken)

// Get user's cart
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Add item to cart
router.post('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    const { product_id, quantity } = req.body

    // Check if item already exists in cart
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single()

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select('*, product:products(*)')
        .single()

      if (error) {
        return res.status(400).json({ error: error.message })
      }

      return res.json(data)
    }

    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id, quantity })
      .select('*, product:products(*)')
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update cart item
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .select('*, product:products(*)')
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Remove item from cart
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from('cart_items').delete().eq('id', id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Item removed from cart' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Clear cart
router.delete('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { error } = await supabase.from('cart_items').delete().eq('user_id', userId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Cart cleared' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
