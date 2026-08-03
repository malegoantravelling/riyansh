import { Router } from 'express'

const router = Router()

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
