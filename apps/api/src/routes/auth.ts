import { Router } from 'express'
import crypto from 'crypto'

const router = Router()

function adminCredentials(): { username: string; password: string } | null {
  const username = (process.env.ADMIN_USERNAME || '').trim()
  const password = (process.env.ADMIN_PASSWORD || '').trim()
  if (!username || !password) return null
  return { username, password }
}

function issueAdminToken(): string | null {
  return (process.env.ADMIN_API_TOKEN || '').trim() || null
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

function credentialsMatch(inputUser: string, inputPass: string, expected: { username: string; password: string }): boolean {
  return safeEqual(inputUser, expected.username) && safeEqual(inputPass, expected.password)
}

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const creds = adminCredentials()
    const token = issueAdminToken()

    if (!creds || !token) {
      return res.status(503).json({
        error: 'Admin login is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_API_TOKEN.',
      })
    }

    if (
      typeof username === 'string' &&
      typeof password === 'string' &&
      credentialsMatch(username, password, creds)
    ) {
      return res.json({
        success: true,
        token,
        user: { username: creds.username, role: 'admin' },
      })
    }

    return res.status(401).json({ error: 'Invalid credentials' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
