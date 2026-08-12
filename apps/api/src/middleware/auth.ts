import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import {
  createAnonClient,
  createUserClient,
  supabase,
  supabaseServiceKey,
} from '../config/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface AuthRequest extends Request {
  user?: any
  accessToken?: string
  supabaseUser?: SupabaseClient
}

function authDebugEnabled(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.AUTH_DEBUG === '1'
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

    req.accessToken = token

    // 1) Validate JWT with anon key (same key the web app uses — works even if service_role is bad).
    try {
      const anon = createAnonClient()
      const {
        data: { user },
        error,
      } = await anon.auth.getUser(token)
      if (!error && user) {
        req.user = user
        req.supabaseUser = createUserClient(token)
        return next()
      }
      if (error && authDebugEnabled()) {
        console.warn('[auth] anon getUser:', error.message)
      }
    } catch (err: any) {
      console.warn('[auth] anon client unavailable:', err?.message || err)
    }

    // 2) Fallback: service role getUser (only if service key is valid).
    if (supabaseServiceKey) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token)
      if (!error && user) {
        req.user = user
        try {
          req.supabaseUser = createUserClient(token)
        } catch {
          req.supabaseUser = supabase
        }
        return next()
      }
      if (error) {
        console.warn('[auth] service getUser failed:', error.message)
      }
    }

    // 3) Fallback: local JWT secret verify.
    const fromSecret = userFromJwtSecret(token)
    if (fromSecret) {
      req.user = fromSecret
      try {
        req.supabaseUser = createUserClient(token)
      } catch {
        // leave undefined
      }
      return next()
    }

    return res.status(401).json({
      error: 'Invalid or expired token',
      code: 'auth_token_invalid',
      ...(authDebugEnabled()
        ? {
            detail:
              'Could not validate user JWT. Ensure SUPABASE_ANON_KEY on the API matches the web app.',
          }
        : {}),
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
