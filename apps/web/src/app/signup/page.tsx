'use client'

import { FormEvent, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { mapOAuthLoginError } from '@/lib/authRedirect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const authError = searchParams.get('error')
  const { signUpWithPassword, signInWithGoogle } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(mapOAuthLoginError(authError))
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    const { error: signUpError } = await signUpWithPassword(email, password, fullName)
    setSubmitting(false)
    if (signUpError) {
      setError(signUpError)
      return
    }
    setMessage('Account created. You can sign in now.')
    router.push(`/login?next=${encodeURIComponent(next)}`)
    router.refresh()
  }

  const onGoogle = async () => {
    setError(null)
    const { error: googleError } = await signInWithGoogle(next)
    if (googleError) setError(googleError)
  }

  return (
    <div className="page-shell surface-band flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-evergreen/10 bg-[linear-gradient(165deg,#024a30_0%,#013220_28%,#f7fbf8_62%,#ffffff_100%)] p-8 shadow-lift">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="font-display text-[32px] font-medium leading-none tracking-tight text-white">
              RIYANSH
            </span>
          </Link>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/70">
            Health Care At A Click
          </p>
          <h1 className="mt-6 font-display text-2xl font-medium text-white">Create your account</h1>
          <p className="mt-1 text-sm text-white/75">Sign up to shop and save your wishlist</p>
        </div>

        <div className="rounded-2xl border border-evergreen/8 bg-white/95 p-5 shadow-soft backdrop-blur-sm sm:p-6">
          {error && (
            <div className="mb-4 border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 border border-evergreen/15 bg-jade/40 px-3 py-2 text-sm text-evergreen">
              {message}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full border-evergreen/15 bg-white text-evergreen hover:border-evergreen/30 hover:bg-jade/40 hover:text-evergreen"
            onClick={onGoogle}
            disabled={submitting}
          >
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-dusty-olive">
            <span className="h-px flex-1 bg-evergreen/10" />
            or
            <span className="h-px flex-1 bg-evergreen/10" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-evergreen">
                Full name
              </Label>
              <Input
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-evergreen">
                Email
              </Label>
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
              <Label htmlFor="password" className="text-evergreen">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full bg-evergreen text-white hover:bg-evergreen-deep hover:text-white"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Sign up'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-dusty-olive">
            Already have an account?{' '}
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="font-semibold text-evergreen transition-colors hover:text-evergreen-deep hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center">Loading…</div>}>
      <SignupForm />
    </Suspense>
  )
}
