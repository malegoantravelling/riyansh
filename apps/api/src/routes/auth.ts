import { Router } from 'express'
import { supabase } from '../config/supabase'

const router = Router()

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name,
      })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail the signup if profile creation fails
      }
    }

    res.json({ user: data.user, session: data.session })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Sign in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Provide user-friendly error messages
      if (error.message.includes('Invalid login credentials')) {
        return res.status(401).json({ error: 'User not registered or incorrect password' })
      } else if (error.message.includes('Email not confirmed')) {
        return res.status(403).json({ error: 'Please verify your email before logging in' })
      }
      return res.status(400).json({ error: error.message })
    }

    res.json({ user: data.user, session: data.session })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Sign out
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Logged out successfully' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Admin login (hardcoded)
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (username === 'admin' && password === 'admin123') {
      // Generate a simple token (in production, use JWT properly)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      res.json({
        success: true,
        token,
        user: { username, role: 'admin' },
      })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
