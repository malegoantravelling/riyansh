const PRODUCTION_SITE_URL = 'https://riyanshamrit.com'

/**
 * Origin used for OAuth redirectTo. Must match the browser tab where sign-in
 * started so PKCE verifier cookies and the callback URL stay on the same host.
 */
export function resolveOAuthRedirectOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NODE_ENV === 'production' ? PRODUCTION_SITE_URL : 'http://localhost:3000')
  ).replace(/\/$/, '')
}

export function buildAuthCallbackUrl(next = '/'): string {
  const safeNext = next.startsWith('/') ? next : '/'
  return `${resolveOAuthRedirectOrigin()}/auth/callback?next=${encodeURIComponent(safeNext)}`
}

export function mapOAuthLoginError(errorParam: string | null): string | null {
  if (!errorParam) return null

  switch (errorParam) {
    case 'oauth_state_expired':
      return 'Your sign-in session expired. Please try Google sign-in again.'
    case 'auth_callback':
      return 'Google sign-in failed. Please try again.'
    default:
      return null
  }
}

export function hasOAuthCallbackParams(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has('code') ||
    searchParams.has('error') ||
    searchParams.has('error_code') ||
    searchParams.has('error_description')
  )
}
