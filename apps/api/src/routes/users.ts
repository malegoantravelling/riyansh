import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// User profile routes require authentication
// Admin routes will be handled separately

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get current user
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()

    if (error) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
router.put('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('users')
      .update(req.body)
      .eq('id', userId)
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

// Admin: Update any user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, email } = req.body

    const { data, error } = await supabase
      .from('users')
      .update({ full_name, email })
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

// Admin: Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Delete from auth.users first (this will cascade to public.users due to foreign key)
    const { error: authError } = await supabase.auth.admin.deleteUser(id)

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
