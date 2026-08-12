import { Router } from 'express'
import { supabase } from '../config/supabase'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { authenticateAdmin } from '../middleware/adminAuth'
import { ensurePublicUser } from '../lib/ensurePublicUser'

const router = Router()

// User profile routes require authentication
// Admin routes will be handled separately

// Get all users (admin only)
router.get('/', authenticateAdmin, async (req, res) => {
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

// Get current user (upsert profile if missing after OAuth)
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id
    const email = req.user?.email

    let { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle()

    if (!data && userId && email) {
      const meta = (req.user as any)?.user_metadata || {}
      const { data: created, error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            id: userId,
            email,
            full_name: meta.full_name || meta.name || email.split('@')[0],
            avatar_url: meta.avatar_url || meta.picture || null,
          },
          { onConflict: 'id' }
        )
        .select()
        .single()

      if (upsertError) {
        return res.status(400).json({ error: upsertError.message })
      }
      data = created
      error = null
    }

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/ensure', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const ensured = await ensurePublicUser({
      id: req.user?.id,
      email: req.user?.email,
      user_metadata: {
        ...((req.user as any)?.user_metadata || {}),
        full_name: req.body?.full_name,
        avatar_url: req.body?.avatar_url,
      },
    })
    if (ensured.error || !ensured.user) {
      return res.status(400).json({ error: ensured.error || 'Missing auth user' })
    }

    if (req.body?.phone) {
      const { data, error } = await supabase
        .from('users')
        .update({ phone: req.body.phone })
        .eq('id', ensured.user.id)
        .select()
        .single()
      if (error) {
        return res.status(400).json({ error: error.message })
      }
      return res.json(data)
    }

    res.json(ensured.user)
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
router.put('/:id', authenticateAdmin, async (req, res) => {
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
router.delete('/:id', authenticateAdmin, async (req, res) => {
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
