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
      .from('wishlist_items')
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

router.post('/sync', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return
    const client = db(req)
    const productIds: string[] = Array.isArray(req.body?.product_ids) ? req.body.product_ids : []

    for (const product_id of productIds) {
      const { data: existing, error: existingError } = await client
        .from('wishlist_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', product_id)
        .maybeSingle()

      if (existingError) {
        return res.status(400).json({ error: existingError.message })
      }

      if (!existing) {
        const { error: insertError } = await client
          .from('wishlist_items')
          .insert({ user_id: userId, product_id })
        if (insertError) {
          return res.status(400).json({ error: insertError.message })
        }
      }
    }

    const { data, error } = await client
      .from('wishlist_items')
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
    const { product_id } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' })
    }

    const client = db(req)
    const { data: existing } = await client
      .from('wishlist_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle()

    if (existing) {
      return res.json(existing)
    }

    const { data, error } = await client
      .from('wishlist_items')
      .insert({ user_id: userId, product_id })
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

router.delete('/:productId', async (req: AuthRequest, res) => {
  try {
    const userId = await requirePublicUser(req, res)
    if (!userId) return
    const { productId } = req.params

    const { error } = await db(req)
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Removed from wishlist' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
