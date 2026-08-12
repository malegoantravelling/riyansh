import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

function adminApiToken(): string | null {
  const token = (process.env.ADMIN_API_TOKEN || '').trim()
  return token || null
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

/** Protects admin panel mutations (products, orders, users, etc.). */
export function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = adminApiToken()
  if (!expected) {
    return res.status(503).json({
      error: 'Admin API is not configured. Set ADMIN_API_TOKEN on the API server.',
    })
  }

  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
  if (!token || !safeEqual(token, expected)) {
    return res.status(401).json({ error: 'Admin access required' })
  }

  next()
}
