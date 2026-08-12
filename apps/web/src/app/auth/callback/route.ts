import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function resolveRedirectOrigin(request: Request, fallbackOrigin: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
  const isLocalDev = process.env.NODE_ENV === 'development'

  if (isLocalDev) {
    return fallbackOrigin
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  return fallbackOrigin
}

function buildLoginRedirect(
  origin: string,
  reason: 'oauth_state_expired' | 'auth_callback',
  next?: string | null
): URL {
  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('error', reason)
  if (next?.startsWith('/')) {
    loginUrl.searchParams.set('next', next)
  }
  return loginUrl
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = resolveRedirectOrigin(request, requestUrl.origin)
  const next = requestUrl.searchParams.get('next') ?? '/'
  const safeNext = next.startsWith('/') ? next : '/'

  const oauthError = requestUrl.searchParams.get('error')
  const errorCode = requestUrl.searchParams.get('error_code')
  const errorDescription = requestUrl.searchParams.get('error_description') ?? ''

  if (oauthError || errorCode) {
    const isExpiredState =
      errorCode === 'bad_oauth_state' ||
      oauthError === 'invalid_request' ||
      /expired/i.test(errorDescription)

    return NextResponse.redirect(
      buildLoginRedirect(origin, isExpiredState ? 'oauth_state_expired' : 'auth_callback', safeNext)
    )
  }

  const code = requestUrl.searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`)
    }

    console.error('[auth/callback] exchangeCodeForSession failed:', error.message)
  }

  return NextResponse.redirect(buildLoginRedirect(origin, 'auth_callback', safeNext))
}
