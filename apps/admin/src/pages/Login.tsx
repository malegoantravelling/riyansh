import { useEffect, useState } from 'react'
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

const REMEMBER_KEY = 'riyansh_admin_remember_user'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY)
      if (saved) {
        setUsername(saved)
        setRemember(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api.post('/api/auth/admin/login', { username, password })

      if (data.token) {
        localStorage.setItem('admin_token', data.token)
        try {
          if (remember) localStorage.setItem(REMEMBER_KEY, username)
          else localStorage.removeItem(REMEMBER_KEY)
        } catch {
          /* ignore */
        }
        onLogin()
      } else {
        setError('Invalid username or password')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed. Check the API is running.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f7f8f5] font-sans text-[#013220]">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(123,166,114,0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(1,50,32,0.08), transparent 50%), linear-gradient(165deg, #fafaf8 0%, #f0f2eb 45%, #e8ebe3 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-[#013220]/[0.06] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[#7ba672]/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col lg:min-h-screen lg:flex-row lg:items-stretch">
        {/* Brand panel */}
        <aside className="relative flex flex-1 flex-col justify-between overflow-hidden px-8 py-10 text-white sm:px-12 lg:max-w-[46%] lg:px-14 lg:py-14">
          <div
            className="absolute inset-3 overflow-hidden rounded-[1.75rem] bg-[#013220] sm:inset-4 lg:inset-6"
            aria-hidden
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(123,166,114,0.45), transparent 45%), radial-gradient(circle at 80% 80%, rgba(61,93,54,0.7), transparent 50%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
            />
          </div>

          <div className="relative z-10 pt-4 lg:pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Internal access
            </p>
            <h1 className="mt-6 font-display text-[clamp(2.75rem,6vw,4.25rem)] font-semibold leading-[0.95] tracking-tight">
              RIYANSH
            </h1>
            <p className="mt-3 max-w-xs text-base font-medium text-[#c1c3ac]">Admin panel</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
              Manage catalog, orders, and customers for the Ayurvedic storefront.
            </p>
          </div>

          <div className="relative z-10 mt-10 hidden space-y-3 border-t border-white/10 pt-8 lg:mt-0 lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
              Signed access only
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Use your admin credentials. Sessions expire when the API token is rotated.
            </p>
          </div>
        </aside>

        {/* Form panel */}
        <main className="relative flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          <div className="w-full max-w-[400px]">
            <div className="mb-8 lg:mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#80866e]">
                Welcome back
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#013220]">
                Sign in
              </h2>
              <p className="mt-2 text-sm text-[#80866e]">Enter your admin username and password.</p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="font-medium leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3d5d36]">
                  Username
                </label>
                <div className="relative mt-2">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#80866e]" />
                  <input
                    id="username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="admin"
                    className="h-12 w-full rounded-xl border border-[#013220]/12 bg-white pl-11 pr-4 text-sm text-[#013220] shadow-sm outline-none transition placeholder:text-[#a8ad9a] focus:border-[#013220]/35 focus:ring-2 focus:ring-[#013220]/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.1em] text-[#3d5d36]">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#80866e]" />
                  <input
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-[#013220]/12 bg-white pl-11 pr-11 text-sm text-[#013220] shadow-sm outline-none transition placeholder:text-[#a8ad9a] focus:border-[#013220]/35 focus:ring-2 focus:ring-[#013220]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#80866e] transition hover:text-[#013220] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#013220]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#013220]/25 text-[#013220] focus:ring-[#013220]/30"
                />
                <span className="text-sm text-[#3d5d36]">Remember username on this device</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#013220] text-sm font-semibold text-white shadow-[0_10px_28px_-12px_rgba(1,50,32,0.55)] transition',
                  'hover:bg-[#0a3d28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#013220]',
                  'disabled:cursor-not-allowed disabled:opacity-70'
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-[#80866e]">© {new Date().getFullYear()} Riyansh Multitrade</p>
          </div>
        </main>
      </div>
    </div>
  )
}
