import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'

export interface AuthRequest extends Request {
  user?: any
}

function authDebugEnabled(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.AUTH_DEBUG === '1'
}

function getAnonClient() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const anon = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  ).trim()
  if (!url || !anon) return null
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function userFromJwtSecret(token: string): { id: string; email?: string; user_metadata?: any } | null {
  const secret = (process.env.SUPABASE_JWT_SECRET || '').trim()
  if (!secret) return null
  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload
    if (!payload?.sub) return null
    return {
      id: String(payload.sub),
      email: typeof payload.email === 'string' ? payload.email : undefined,
      user_metadata: (payload.user_metadata as any) || {},
    }
  } catch {
    return null
  }
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token required', code: 'auth_token_missing' })
    }

    // 1) Preferred: validate JWT with GoTrue (service role client).
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (!error && user) {
      req.user = user
      return next()
    }

    // 2) Fallback: anon-key client (same project JWT audience).
    const anon = getAnonClient()
    if (anon) {
      const second = await anon.auth.getUser(token)
      if (!second.error && second.data.user) {
        req.user = second.data.user
        return next()
      }
    }

    // 3) Fallback: local verify with JWT secret (Dashboard → Settings → API → JWT Secret).
    const fromSecret = userFromJwtSecret(token)
    if (fromSecret) {
      req.user = fromSecret
      return next()
    }

    const detail = error?.message || 'No user for token'
    console.warn('[auth] getUser failed:', detail)
    return res.status(401).json({
      error: 'Invalid or expired token',
      code: 'auth_token_invalid',
      ...(authDebugEnabled() ? { detail } : {}),
    })
  } catch (error) {
    console.error('[auth] authenticateToken exception:', error)
    res.status(500).json({ error: 'Authentication failed', code: 'auth_exception' })
  }
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const adminEmails = ['admin@riyansh.com']

  if (!req.user || !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ error: 'Admin access required' })
  }

  next()
}
