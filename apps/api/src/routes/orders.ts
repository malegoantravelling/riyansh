import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { authenticateAdmin } from '../middleware/adminAuth'
import { sendOrderConfirmationEmail } from '../services/emailService'
import {
  formatPayUAmount,
  generatePaymentHash,
  generateTxnId,
  getPayUConfig,
  initiatePayUUpiIntent,
  isPayUPendingStatus,
  isPayUSuccessStatus,
  isPayUUpiApp,
  verifyPayUPayment,
  verifyReverseHash,
  type PayUUpiApp,
} from '../services/payu'
import { resolveApiUrl, resolveSiteUrl } from '../config/urls'
import { ensurePublicUser } from '../lib/ensurePublicUser'
import { insertPayUTransaction, saveDefaultUserAddress } from '../lib/orderPersistence'

const router = Router()

function normalizePublicOrigin(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.origin
  } catch {
    return null
  }
}

function defaultApiBaseFromSurl(surl: string): string {
  try {
    return new URL(surl).origin
  } catch {
    return resolveApiUrl()
  }
}

function resolveCallbackSiteUrl(body: Record<string, any>, order: any, fallback: string): string {
  const fromOrder = normalizePublicOrigin(order?.shipping_address?._return_origin)
  if (fromOrder) return fromOrder
  return normalizePublicOrigin(body.udf2) || fallback
}

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(id, name, slug, image_url))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    const enriched = (data || []).map((order: any) => ({
      ...order,
      items: (order.items || []).map((item: any) => {
        const product = item.product
        return {
          ...item,
          product_name: product?.name || item.product_name,
          product_image: product?.image_url || item.product_image,
          product_slug: product?.slug || null,
          product: undefined,
        }
      }),
    }))

    res.json(enriched)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/all', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        '*, items:order_items(*, product:products(id, slug, name, image_url)), user:users(*)'
      )
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Create pending order + PayU Hosted Checkout fields, or UPI Intent deep links.
 * Body:
 * - payment_method: 'hosted' (default) | 'upi_intent'
 * - upi_app: phonepe | googlepay | paytm | genericintent (required for upi_intent)
 * - device_info: User-Agent (recommended for UPI Intent)
 */
router.post('/create-payu-order', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userDb = req.supabaseUser || supabase
    const ensured = await ensurePublicUser(req.user, req.supabaseUser)
    if (ensured.error || !ensured.user) {
      return res.status(400).json({
        error: ensured.error || 'Could not ensure user profile',
        code: 'user_profile_required',
      })
    }
    const userId = ensured.user.id as string
    if (!req.user?.email) {
      req.user = { ...(req.user || {}), email: ensured.user.email, id: userId }
    }

    const {
      shipping_address,
      billing_address,
      notes,
      site_url,
      api_base,
      payment_method,
      upi_app,
      device_info,
      enforce_paymethod,
      items: clientItems,
    } = req.body
    if (!shipping_address?.phone || !shipping_address?.address1 || !shipping_address?.city) {
      return res.status(400).json({ error: 'Complete shipping address is required' })
    }

    const method = String(payment_method || 'hosted').toLowerCase()
    const useUpiIntent = method === 'upi_intent' || method === 'upi'
    let upiApp: PayUUpiApp = 'genericintent'
    if (useUpiIntent) {
      if (!isPayUUpiApp(upi_app)) {
        return res.status(400).json({
          error: 'upi_app must be one of: phonepe, googlepay, paytm, bhim, amazonpay, genericintent',
        })
      }
      upiApp = upi_app
    }

    const payu = getPayUConfig()
    const siteUrl = normalizePublicOrigin(site_url) || payu.siteUrl
    const apiBase = normalizePublicOrigin(api_base) || defaultApiBaseFromSurl(payu.surl)
    const surl = `${apiBase}/api/orders/payu/success`
    const furl = `${apiBase}/api/orders/payu/failure`

    // Sync client cart into DB when provided (localStorage cart → server).
    const syncItems: Array<{ product_id: string; quantity: number }> = Array.isArray(clientItems)
      ? clientItems
      : []
    for (const item of syncItems) {
      if (!item?.product_id || !item?.quantity || item.quantity < 1) continue
      const { data: existing } = await userDb
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('product_id', item.product_id)
        .maybeSingle()
      if (existing) {
        await userDb
          .from('cart_items')
          .update({ quantity: Math.max(existing.quantity, item.quantity) })
          .eq('id', existing.id)
      } else {
        const { error: insertError } = await userDb.from('cart_items').insert({
          user_id: userId,
          product_id: item.product_id,
          quantity: item.quantity,
        })
        if (insertError) {
          return res.status(400).json({
            error: insertError.message,
            code: 'cart_insert_failed',
          })
        }
      }
    }

    const { data: cartRows, error: cartError } = await userDb
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)

    const cartItems = (cartRows || []).filter((row: any) => row.product)
    if (cartError || cartItems.length === 0) {
      return res.status(400).json({
        error: cartError?.message || 'Cart is empty. Add products again, then retry payment.',
        code: 'cart_empty',
      })
    }

    const email = ensured.user.email || req.user?.email
    if (!email) {
      return res.status(400).json({ error: 'User email is required for payment' })
    }

    const userProfile = {
      full_name: ensured.user.full_name,
      email,
      phone: ensured.user.phone,
    }

    const totalAmount = cartItems.reduce(
      (sum, item: any) => sum + Number(item.product.price) * item.quantity,
      0
    )
    const amount = formatPayUAmount(totalAmount)
    const txnid = generateTxnId()
    const firstname =
      shipping_address.firstname ||
      userProfile?.full_name?.split(' ')[0] ||
      email.split('@')[0]
    const nameParts = String(userProfile?.full_name || shipping_address.firstname || '').trim().split(/\s+/)
    const lastname =
      shipping_address.lastname ||
      (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '') ||
      'Customer'
    const productinfo =
      cartItems
        .map((item: any) => item.product.name)
        .join(', ')
        .replace(/[^\w\s.,\-]/g, '')
        .slice(0, 100) || 'Order'

    const paymentMethodLabel = useUpiIntent ? `upi_intent:${upiApp}` : 'hosted'
    const shippingWithReturn = {
      ...shipping_address,
      _return_origin: siteUrl,
      _payment_method: paymentMethodLabel,
    }

    const { data: order, error: orderError } = await userDb
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingWithReturn,
        billing_address: billing_address || shipping_address,
        notes: notes || null,
        status: 'pending',
        payu_txnid: txnid,
        payu_status: 'initiated',
        payment_method: paymentMethodLabel,
      })
      .select()
      .single()

    // Persist address early so reorders / next checkout can prefill even if PayU is abandoned.
    try {
      await saveDefaultUserAddress(userId, shippingWithReturn, {
        preferredUpiApp: useUpiIntent ? upiApp : null,
        notes: notes || null,
      })
    } catch (addrErr) {
      console.error('Failed to save user address:', addrErr)
    }

    if (orderError || !order) {
      return res.status(400).json({ error: orderError?.message || 'Failed to create order' })
    }

    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      product_image: item.product.image_url,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const { error: itemsError } = await userDb.from('order_items').insert(orderItems)
    if (itemsError) {
      await userDb.from('orders').delete().eq('id', order.id)
      return res.status(400).json({ error: itemsError.message })
    }

    const phone = String(shipping_address.phone).replace(/\D/g, '').slice(-10)
    const zipcode = String(shipping_address.zipcode || shipping_address.pincode || '').replace(
      /\s+/g,
      ''
    )

    if (useUpiIntent) {
      const forwarded = req.headers['x-forwarded-for']
      const clientIp =
        (typeof forwarded === 'string' ? forwarded.split(',')[0] : '') ||
        req.socket.remoteAddress ||
        '127.0.0.1'
      const deviceInfo =
        (typeof device_info === 'string' && device_info.trim()) ||
        (typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : '') ||
        'Mozilla/5.0'

      try {
        const intent = await initiatePayUUpiIntent({
          txnid,
          amount,
          productinfo,
          firstname,
          lastname,
          email,
          phone,
          surl,
          furl,
          udf1: order.id,
          address1: shipping_address.address1 || '',
          city: shipping_address.city || '',
          state: shipping_address.state || '',
          country: shipping_address.country || 'India',
          zipcode,
          upiApp,
          clientIp: clientIp.replace(/^::ffff:/, ''),
          deviceInfo,
        })

        if (intent.paymentId) {
          await supabase
            .from('orders')
            .update({ payu_mihpayid: intent.paymentId, payu_status: 'pending' })
            .eq('id', order.id)
        } else {
          await supabase.from('orders').update({ payu_status: 'pending' }).eq('id', order.id)
        }

        console.log(
          `[PayU] UPI Intent app=${upiApp} txnid=${txnid} order=${order.id} paymentId=${intent.paymentId || '-'}`
        )

        return res.status(201).json({
          order_id: order.id,
          txnid,
          flow: 'upi_intent',
          upi_app: upiApp,
          deep_link: intent.deepLink,
          android_intent_url: intent.androidIntentUrl,
          ios_deep_link: intent.iosDeepLink,
          pending_url: `${siteUrl}/orders/pending?order_id=${encodeURIComponent(order.id)}&txnid=${encodeURIComponent(txnid)}`,
        })
      } catch (intentError: any) {
        console.error('[PayU] UPI Intent failed:', intentError?.message || intentError)
        await supabase
          .from('orders')
          .update({ payu_status: 'intent_failed', status: 'cancelled' })
          .eq('id', order.id)
        return res.status(502).json({
          error:
            intentError?.message ||
            'Could not start UPI app payment. Try Cards & more on PayU, or enable UPI Intent with PayU.',
        })
      }
    }

    const hash = generatePaymentHash({
      key: payu.key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1: order.id,
      salt: payu.salt,
    })

    // Hosted: optional enforce from client (creditcard|debitcard|netbanking|cashcard) or env.
    const fromClient =
      typeof enforce_paymethod === 'string' ? enforce_paymethod.trim() : ''
    const enforcePayMethods =
      fromClient || (process.env.PAYU_ENFORCE_PAYMETHODS || '').trim()
    const fields: Record<string, string> = {
      key: payu.key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      udf1: order.id,
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
      address1: shipping_address.address1 || '',
      city: shipping_address.city || '',
      state: shipping_address.state || '',
      country: shipping_address.country || 'India',
      zipcode,
    }

    if (enforcePayMethods) {
      fields.enforce_paymethod = enforcePayMethods
    }

    console.log(
      `[PayU] mode=${payu.mode} endpoint=${payu.paymentUrl} key=${payu.key.slice(0, 2)}*** txnid=${txnid} surl=${surl} flow=hosted methods=${enforcePayMethods || 'all-enabled'}`
    )

    res.status(201).json({
      order_id: order.id,
      txnid,
      flow: 'hosted',
      payment_url: payu.paymentUrl,
      fields,
    })
  } catch (error: any) {
    console.error('Error creating PayU order:', error)
    res.status(500).json({ error: error.message })
  }
})

async function markOrderPaid(
  order: any,
  details: {
    txnid: string
    mihpayid?: string | null
    status: string
    mode?: string | null
    raw?: Record<string, unknown>
    bank_ref_num?: string | null
    phone?: string | null
    firstname?: string | null
    email?: string | null
  }
) {
  if (order.status === 'paid') {
    return { alreadyPaid: true }
  }

  const paymentMethod =
    order.payment_method ||
    order.shipping_address?._payment_method ||
    (details.mode ? `PayU:${details.mode}` : 'PayU')

  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      payu_mihpayid: details.mihpayid || null,
      payu_status: details.status,
      paid_at: new Date().toISOString(),
      payment_method: paymentMethod,
      payment_mode: details.mode || null,
    })
    .eq('id', order.id)

  if (updateError) {
    throw new Error(updateError.message)
  }

  await insertPayUTransaction({
    userId: order.user_id,
    orderId: order.id,
    amount: order.total_amount,
    status: 'success',
    txnid: details.txnid,
    mihpayid: details.mihpayid || null,
    mode: details.mode || null,
    paymentMethod: paymentMethod,
    description: `PayU payment for order #${order.id.substring(0, 8)}`,
    raw: details.raw || (details as any),
    metadata: { bank_ref_num: details.bank_ref_num },
  })

  try {
    await saveDefaultUserAddress(order.user_id, order.shipping_address, {
      notes: order.notes || null,
    })
  } catch (addrErr) {
    console.error('Failed to save user address after payment:', addrErr)
  }

  try {
    await supabase.from('activity_logs').insert({
      user_id: order.user_id,
      action: 'payment_success',
      entity_type: 'order',
      entity_id: order.id,
      description: `PayU payment successful for order #${order.id.substring(0, 8)}`,
      metadata: { txnid: details.txnid, mihpayid: details.mihpayid, amount: order.total_amount },
    })
  } catch {
    // optional table
  }

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)

  const { data: userProfile } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', order.user_id)
    .single()

  try {
    await sendOrderConfirmationEmail({
      orderId: order.id,
      orderDate: new Date(order.created_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      totalAmount: order.total_amount,
      paymentId: details.mihpayid || details.txnid,
      paymentMethod: 'PayU',
      customerName: userProfile?.full_name || details.firstname || 'Customer',
      customerEmail: userProfile?.email || details.email || 'N/A',
      customerPhone: order.shipping_address?.phone || details.phone || 'N/A',
      shippingAddress: order.shipping_address,
      orderItems: orderItems || [],
    })
  } catch (emailError) {
    console.error('Failed to send order email:', emailError)
  }

  await supabase.from('cart_items').delete().eq('user_id', order.user_id)
  return { alreadyPaid: false }
}

async function findOrderForPayU(orderId?: string, txnid?: string) {
  let orderQuery = supabase.from('orders').select('*')
  if (orderId) {
    orderQuery = orderQuery.eq('id', orderId)
  } else if (txnid) {
    orderQuery = orderQuery.eq('payu_txnid', txnid)
  } else {
    return null
  }
  const { data: order, error } = await orderQuery.maybeSingle()
  if (error) {
    console.error('Order fetch error', error)
    return null
  }
  return order
}

async function handlePayUCallback(req: any, res: any, kind: 'success' | 'failure') {
  try {
    const payu = getPayUConfig()
    const body = { ...(req.query || {}), ...(req.body || {}) }

    console.log(`[PayU callback ${kind}]`, {
      txnid: body.txnid,
      status: body.status,
      udf1: body.udf1,
      mihpayid: body.mihpayid,
      error: body.error_Message || body.field9,
    })

    const hasHash = Boolean(body.hash && body.status && body.txnid && body.key)
    let hashOk = false
    if (hasHash) {
      hashOk = verifyReverseHash(
        {
          key: body.key,
          txnid: body.txnid,
          amount: body.amount,
          productinfo: body.productinfo,
          firstname: body.firstname,
          email: body.email,
          status: body.status,
          hash: body.hash,
          udf1: body.udf1,
          udf2: body.udf2,
          udf3: body.udf3,
          udf4: body.udf4,
          udf5: body.udf5,
          additionalCharges: body.additionalCharges || body.additional_charges,
        },
        payu.salt
      )
      if (!hashOk) {
        console.warn('PayU reverse hash mismatch; falling back to verify_payment', body.txnid)
      }
    }

    const orderId = body.udf1
    const txnid = body.txnid
    let status = String(body.status || '').toLowerCase()

    const order = await findOrderForPayU(orderId, txnid)
    const siteUrl = resolveCallbackSiteUrl(body, order, payu.siteUrl)

    if (!order) {
      console.error('Order not found for PayU callback', txnid, orderId)
      return res.redirect(`${siteUrl}/orders/failure?reason=order_not_found`)
    }

    // Always reconcile with PayU so success/failure is authoritative (UPI/cards).
    let verified = null as Awaited<ReturnType<typeof verifyPayUPayment>>
    try {
      verified = txnid ? await verifyPayUPayment(String(txnid)) : null
      if (verified?.status) {
        status = verified.status.toLowerCase()
        console.log('[PayU verify]', txnid, status, verified.unmappedstatus, verified.error_Message)
      }
    } catch (verifyError) {
      console.error('PayU verify_payment failed in callback', verifyError)
      if (!hashOk && !status) {
        return res.redirect(`${siteUrl}/orders/failure?reason=verify_failed`)
      }
    }

    const trustResult = hashOk || Boolean(verified)
    if (isPayUSuccessStatus(status) && trustResult) {
      await markOrderPaid(order, {
        txnid: String(txnid),
        mihpayid: verified?.mihpayid || body.mihpayid || null,
        status,
        mode: verified?.mode || body.mode || null,
        raw: verified?.raw || body,
        bank_ref_num: verified?.bank_ref_num || body.bank_ref_num || null,
        phone: body.phone || null,
        firstname: body.firstname || null,
        email: body.email || null,
      })

      return res.redirect(
        `${siteUrl}/orders/success?order_id=${encodeURIComponent(order.id)}&txnid=${encodeURIComponent(String(txnid))}`
      )
    }

    if (isPayUPendingStatus(status)) {
      await supabase
        .from('orders')
        .update({
          payu_mihpayid: verified?.mihpayid || body.mihpayid || null,
          payu_status: status || 'pending',
        })
        .eq('id', order.id)

      return res.redirect(
        `${siteUrl}/orders/pending?order_id=${encodeURIComponent(order.id)}&txnid=${encodeURIComponent(String(txnid || order.payu_txnid || ''))}`
      )
    }

    const errorMessage =
      verified?.error_Message || body.error_Message || body.field9 || status || 'failed'

    await supabase
      .from('orders')
      .update({
        status: 'failed',
        payu_mihpayid: verified?.mihpayid || body.mihpayid || null,
        payu_status: status || 'failed',
      })
      .eq('id', order.id)

    await insertPayUTransaction({
      userId: order.user_id,
      orderId: order.id,
      amount: order.total_amount,
      status: status || 'failed',
      txnid,
      mihpayid: verified?.mihpayid || body.mihpayid || null,
      mode: verified?.mode || body.mode || null,
      paymentMethod: order.payment_method || order.shipping_address?._payment_method || 'PayU',
      description: `PayU payment ${status || 'failed'} for order #${order.id.substring(0, 8)}`,
      raw: verified?.raw || body,
    })

    return res.redirect(
      `${siteUrl}/orders/failure?order_id=${encodeURIComponent(order.id)}&status=${encodeURIComponent(status || 'failed')}&message=${encodeURIComponent(String(errorMessage))}`
    )
  } catch (error: any) {
    console.error('PayU callback error:', error)
    const siteUrl = resolveSiteUrl()
    return res.redirect(`${siteUrl}/orders/failure?reason=server_error`)
  }
}

router.post('/payu/success', (req, res) => handlePayUCallback(req, res, 'success'))
router.post('/payu/failure', (req, res) => handlePayUCallback(req, res, 'failure'))
router.get('/payu/success', (req, res) => handlePayUCallback(req, res, 'success'))
router.get('/payu/failure', (req, res) => handlePayUCallback(req, res, 'failure'))

/**
 * Reconcile a pending PayU order (UPI Intent often never redirects).
 */
router.post('/payu/verify', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { order_id, txnid } = req.body || {}
    if (!order_id && !txnid) {
      return res.status(400).json({ error: 'order_id or txnid is required' })
    }

    let orderQuery = supabase.from('orders').select('*').eq('user_id', userId)
    if (order_id) {
      orderQuery = orderQuery.eq('id', order_id)
    } else {
      orderQuery = orderQuery.eq('payu_txnid', txnid)
    }

    const { data: order, error: orderError } = await orderQuery.maybeSingle()
    if (orderError || !order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    if (order.status === 'paid') {
      return res.json({
        order_id: order.id,
        status: 'paid',
        payu_status: order.payu_status,
        txnid: order.payu_txnid,
        mihpayid: order.payu_mihpayid,
      })
    }

    const payuTxn = order.payu_txnid || txnid
    if (!payuTxn) {
      return res.status(400).json({ error: 'Order has no PayU transaction id' })
    }

    const verified = await verifyPayUPayment(String(payuTxn))
    if (!verified) {
      return res.status(404).json({
        order_id: order.id,
        status: order.status,
        payu_status: order.payu_status || 'unknown',
        error: 'Transaction not found at PayU yet',
      })
    }

    if (isPayUSuccessStatus(verified.status)) {
      await markOrderPaid(order, {
        txnid: verified.txnid,
        mihpayid: verified.mihpayid,
        status: verified.status.toLowerCase(),
        mode: verified.mode,
        raw: verified.raw,
        bank_ref_num: verified.bank_ref_num,
      })

      return res.json({
        order_id: order.id,
        status: 'paid',
        payu_status: verified.status.toLowerCase(),
        txnid: verified.txnid,
        mihpayid: verified.mihpayid,
      })
    }

    const failed = !isPayUPendingStatus(verified.status)
    await supabase
      .from('orders')
      .update({
        status: failed ? 'failed' : order.status,
        payu_status: verified.status.toLowerCase(),
        payu_mihpayid: verified.mihpayid || null,
      })
      .eq('id', order.id)

    return res.json({
      order_id: order.id,
      status: failed ? 'failed' : 'pending',
      payu_status: verified.status.toLowerCase(),
      unmappedstatus: verified.unmappedstatus,
      txnid: verified.txnid,
      mihpayid: verified.mihpayid,
      message: verified.error_Message || undefined,
    })
  } catch (error: any) {
    console.error('PayU verify error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(id, slug, name, image_url, price))')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const { data: txn } = await supabase
      .from('transactions')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    res.json({ ...data, transaction: txn || null })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/:id', authenticateAdmin, async (req: AuthRequest, res) => {
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
