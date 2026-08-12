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
    const client = db(req)

    const items: Array<{ product_id: string; quantity: number }> = Array.isArray(req.body?.items)
      ? req.body.items
      : []

    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity < 1) continue

      const { data: existing, error: existingError } = await client
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', item.product_id)
        .maybeSingle()

      if (existingError) {
        return res.status(400).json({ error: existingError.message, code: 'cart_lookup_failed' })
      }

      if (existing) {
        const { error: updateError } = await client
          .from('cart_items')
          .update({ quantity: Math.max(existing.quantity, item.quantity) })
          .eq('id', existing.id)
        if (updateError) {
          return res.status(400).json({ error: updateError.message, code: 'cart_update_failed' })
        }
      } else {
        const { error: insertError } = await client.from('cart_items').insert({
          user_id: userId,
          product_id: item.product_id,
          quantity: item.quantity,
        })
        if (insertError) {
          return res.status(400).json({ error: insertError.message, code: 'cart_insert_failed' })
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

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
