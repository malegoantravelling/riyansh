/**
 * Google Identity / OpenID helpers for Plan B:
 * App owns the OAuth redirect (riyanshamrit.com), then Supabase gets an ID token.
 */

export function getGoogleClientId(): string {
  const id = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '').trim()
  if (!id) {
    throw new Error(
      'Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. Add your Google OAuth Web Client ID to the web env.'
    )
  }
  return id
}

/** Raw nonce for Supabase + SHA-256 hex for the Google auth request. */
export async function generateGoogleNonce(): Promise<{ nonce: string; hashedNonce: string }> {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(nonce))
  const hashedNonce = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return { nonce, hashedNonce }
}

const GOOGLE_OAUTH_NONCE_KEY = 'riyansh_google_oauth_nonce'
const GOOGLE_OAUTH_NEXT_KEY = 'riyansh_google_oauth_next'

export function storeGoogleOAuthState(nonce: string, next: string): void {
  sessionStorage.setItem(GOOGLE_OAUTH_NONCE_KEY, nonce)
  sessionStorage.setItem(GOOGLE_OAUTH_NEXT_KEY, next.startsWith('/') ? next : '/')
}

export function consumeGoogleOAuthState(): { nonce: string | null; next: string } {
  const nonce = sessionStorage.getItem(GOOGLE_OAUTH_NONCE_KEY)
  const next = sessionStorage.getItem(GOOGLE_OAUTH_NEXT_KEY) || '/'
  sessionStorage.removeItem(GOOGLE_OAUTH_NONCE_KEY)
  sessionStorage.removeItem(GOOGLE_OAUTH_NEXT_KEY)
  return { nonce, next: next.startsWith('/') ? next : '/' }
}

/**
 * Start Google OpenID login on the current site origin.
 * Google will show "continue to localhost / riyanshamrit.com" (not *.supabase.co).
 */
export async function startGoogleIdTokenRedirect(next = '/'): Promise<void> {
  const clientId = getGoogleClientId()
  const { nonce, hashedNonce } = await generateGoogleNonce()
  const origin = window.location.origin
  const redirectUri = `${origin}/auth/google/callback`

  storeGoogleOAuthState(nonce, next)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce: hashedNonce,
    prompt: 'select_account',
  })

  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
}
