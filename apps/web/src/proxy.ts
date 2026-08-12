import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Auth gate only — keep matcher narrow so public pages skip Supabase getUser().
 * (Renamed from middleware.ts → proxy.ts for Next.js 16.)
 */
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    '/auth/callback',
    '/checkout',
    '/checkout/:path*',
    '/account',
    '/account/:path*',
    '/login',
    '/signup',
  ],
}
