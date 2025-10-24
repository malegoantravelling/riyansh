import { Router } from 'express'
import { supabase } from '../config/supabase'

const router = Router()

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name')

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

    if (error) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create category (admin only)
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').insert(req.body).select().single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update category (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
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

// Delete category (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
