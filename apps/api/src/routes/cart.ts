import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { ensurePublicUser } from '../lib/ensurePublicUser'

const router = Router()

router.use(authenticateToken)

async function requirePublicUser(req: AuthRequest, res: any): Promise<string | null> {
  const ensured = await ensurePublicUser(req.user, req.supabaseUser)
  if (ensured.error || !ensured.user) {
    res.status(400).json({
      error: ensured.error || 'Could not ensure user profile',
      code: 'user_profile_required',
    })
    return null
  }
  if (!req.user.email) req.user.email = ensured.user.email
  return ensured.user.id as string
}

function db(req: AuthRequest) {
  return req.supabaseUser || supabase
}

router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return

    const { data, error } = await db(req)
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

router.post('/', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return
    const { product_id, quantity } = req.body

    const { data: existing } = await db(req)
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle()

    if (existing) {
      const { data, error } = await db(req)
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

    const { data, error } = await db(req)
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

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return
    const { id } = req.params
    const { quantity } = req.body

    const { data, error } = await db(req)
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', userId)
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

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return
    const { id } = req.params

    const { error } = await db(req).from('cart_items').delete().eq('id', id).eq('user_id', userId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Item removed from cart' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return

    const { error } = await db(req).from('cart_items').delete().eq('user_id', userId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Cart cleared' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/sync', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return
    // Prefer service role for cart writes so sync never fails when anon client is missing
    // or RLS blocks the user-scoped client. Auth already verified the JWT above.
    const client = supabase

    const items: Array<{ product_id: string; quantity: number }> = Array.isArray(req.body?.items)
      ? req.body.items
      : []

    const uuidRe =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    for (const item of items) {
      const productId = String(item?.product_id || '').trim()
      const quantity = Number(item?.quantity)
      if (!productId || !uuidRe.test(productId) || !Number.isFinite(quantity) || quantity < 1) {
        continue
      }

      const { data: product, error: productError } = await client
        .from('products')
        .select('id')
        .eq('id', productId)
        .maybeSingle()

      if (productError || !product) {
        // Stale local cart entry (deleted product / bad id) — skip, don't fail sync.
        continue
      }

      const { data: existing, error: existingError } = await client
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle()

      if (existingError) {
        console.warn('[cart/sync] lookup failed:', existingError.message)
        continue
      }

      if (existing) {
        const { error: updateError } = await client
          .from('cart_items')
          .update({ quantity: Math.max(existing.quantity, quantity) })
          .eq('id', existing.id)
        if (updateError) {
          console.warn('[cart/sync] update failed:', updateError.message)
        }
      } else {
        const { error: insertError } = await client.from('cart_items').insert({
          user_id: userId,
          product_id: productId,
          quantity,
        })
        if (insertError) {
          console.warn('[cart/sync] insert failed:', insertError.message)
        }
      }
    }

    const { data, error } = await client
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data || [])
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
