import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

router.use(authenticateToken)

router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
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
    const userId = req.user?.id
    const productIds: string[] = Array.isArray(req.body?.product_ids) ? req.body.product_ids : []

    for (const product_id of productIds) {
      const { data: existing } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', product_id)
        .maybeSingle()

      if (!existing) {
        await supabase.from('wishlist_items').insert({ user_id: userId, product_id })
      }
    }

    const { data, error } = await supabase
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
    const userId = req.user?.id
    const { product_id } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' })
    }

    const { data: existing } = await supabase
      .from('wishlist_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .maybeSingle()

    if (existing) {
      return res.json(existing)
    }

    const { data, error } = await supabase
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
    const userId = req.user?.id
    const { productId } = req.params

    const { error } = await supabase
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
