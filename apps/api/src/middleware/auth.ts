import { Request, Response, NextFunction } from 'express'
import { supabase } from '../config/supabase'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      const detail = error?.message || 'No user for token'
      console.warn('[auth] getUser failed:', detail)
      return res.status(401).json({
        error: 'Invalid or expired token',
        // Help production debugging without exposing secrets.
        code: 'auth_token_invalid',
        ...(process.env.NODE_ENV === 'development' || process.env.AUTH_DEBUG === '1'
          ? { detail }
          : {}),
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('[auth] authenticateToken exception:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Simple admin check - in production, you'd check a role in the database
  const adminEmails = ['admin@riyansh.com']

  if (!req.user || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: 'Admin access required' })
  }

  next()
}
