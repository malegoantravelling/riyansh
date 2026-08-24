'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { consumeGoogleOAuthState } from '@/lib/googleIdentity'

function GoogleCallbackInner() {
  const router = useRouter()
  const [message, setMessage] = useState('Completing Google sign-in…')

  useEffect(() => {
    let cancelled = false

    const finish = async () => {
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash
      const params = new URLSearchParams(hash || window.location.search)
      const idToken = params.get('id_token')
      const oauthError = params.get('error')
      const { nonce, next } = consumeGoogleOAuthState()

      if (oauthError) {
        setMessage('Google sign-in was cancelled.')
        router.replace(`/login?error=auth_callback&next=${encodeURIComponent(next)}`)
        return
      }

      if (!idToken) {
        setMessage('Missing Google credential.')
        router.replace(`/login?error=auth_callback&next=${encodeURIComponent(next)}`)
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
        ...(nonce ? { nonce } : {}),
      })

      if (cancelled) return

      if (error) {
        console.error('[auth/google/callback]', error.message)
        setMessage(error.message)
        router.replace(`/login?error=auth_callback&next=${encodeURIComponent(next)}`)
        return
      }

      // Clear hash so the token is not left in history.
      window.history.replaceState(null, '', window.location.pathname)
      router.replace(next)
      router.refresh()
    }

    void finish()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 text-sm text-[#80866e]">
      {message}
    </div>
  )
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-sm text-[#80866e]">
          Completing Google sign-in…
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  )
}
