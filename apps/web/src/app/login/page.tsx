'use client'

import { FormEvent, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const authError = searchParams.get('error')
  const { signInWithPassword, signInWithGoogle, loading: authLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(
    authError === 'auth_callback' ? 'Google sign-in failed. Please try again.' : null
  )
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: signInError } = await signInWithPassword(email, password)
    setSubmitting(false)
    if (signInError) {
      setError(signInError)
      return
    }
    router.push(next)
    router.refresh()
  }

  const onGoogle = async () => {
    setError(null)
    const { error: googleError } = await signInWithGoogle(next)
    if (googleError) setError(googleError)
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[linear-gradient(160deg,#FAF8F2_0%,#F6F0E2_45%,#ffffff_100%)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-[32px] leading-none font-extrabold tracking-tight">
              <span className="text-[#222222]">RIY</span>
              <span className="text-[#5B8C51]">ANSH</span>
            </span>
          </Link>
          <p className="mt-2 text-[11px] tracking-[0.18em] uppercase text-[#999999]">
            Health Care At A Click
          </p>
          <h1 className="mt-6 text-2xl font-bold text-[#1A1A1A]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#787878]">Sign in to checkout and track your orders</p>
        </div>

        <div className="bg-white border border-[#EEEEEE] shadow-[0_8px_30px_rgba(91,140,81,0.08)] p-6 sm:p-8">
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-[#DDDDDD] text-[#222222] hover:bg-[#FAF8F2]"
            onClick={onGoogle}
            disabled={submitting || authLoading}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-[#999999]">
            <span className="flex-1 h-px bg-[#EEEEEE]" />
            or
            <span className="flex-1 h-px bg-[#EEEEEE]" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[#5B8C51] hover:bg-[#4E7A45] text-white"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#787878]">
            New here?{' '}
            <Link
              href={`/signup?next=${encodeURIComponent(next)}`}
              className="font-semibold text-[#5B8C51] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading…</div>}>
      <LoginForm />
    </Suspense>
  )
}
