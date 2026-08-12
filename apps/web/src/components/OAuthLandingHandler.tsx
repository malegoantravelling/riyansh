'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { hasOAuthCallbackParams } from '@/lib/authRedirect'

/**
 * Supabase sometimes redirects OAuth results to the Site URL root (/?code=...)
 * instead of /auth/callback. Forward those params so the code exchange runs.
 */
function OAuthLandingHandlerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname === '/auth/callback') return
    if (!hasOAuthCallbackParams(searchParams)) return

    const callback = new URL('/auth/callback', window.location.origin)
    searchParams.forEach((value, key) => {
      callback.searchParams.set(key, value)
    })
    window.location.replace(callback.toString())
  }, [pathname, searchParams])

  return null
}

export function OAuthLandingHandler() {
  return (
    <Suspense fallback={null}>
      <OAuthLandingHandlerInner />
    </Suspense>
  )
}
