'use client'

import { FormEvent, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const { signUpWithPassword, signInWithGoogle } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
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
          <h1 className="mt-6 text-2xl font-bold text-[#1A1A1A]">Create your account</h1>
          <p className="mt-1 text-sm text-[#787878]">Sign up to shop and save your wishlist</p>
        </div>

        <div className="bg-white border border-[#EEEEEE] shadow-[0_8px_30px_rgba(91,140,81,0.08)] p-6 sm:p-8">
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 text-sm text-[#3b5d34] bg-[#edf5eb] border border-[#d4e8cf] px-3 py-2">
              {message}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-[#DDDDDD] text-[#222222] hover:bg-[#FAF8F2]"
            onClick={onGoogle}
            disabled={submitting}
          >
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-[#999999]">
            <span className="flex-1 h-px bg-[#EEEEEE]" />
            or
            <span className="flex-1 h-px bg-[#EEEEEE]" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11"
              />
            </div>
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
              className="w-full h-11 bg-[#5B8C51] hover:bg-[#4E7A45] text-white"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Sign up'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#787878]">
            Already have an account?{' '}
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="font-semibold text-[#5B8C51] hover:underline"
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
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading…</div>}>
      <SignupForm />
    </Suspense>
  )
}
