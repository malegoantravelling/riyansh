/** Canonical production URLs (override via env on each host). */
export const PRODUCTION_SITE_URL = 'https://riyanshamrit.com'
/** Live API on Vercel (api.riyanshamrit.com DNS is not configured). */
export const PRODUCTION_API_URL = 'https://riyansh-api.vercel.app'
export const PRODUCTION_ADMIN_URL = 'https://admin.riyanshamrit.com'

function trim(value: string | undefined): string {
  return (value || '').trim().replace(/\/$/, '')
}

export function resolveSiteUrl(): string {
  return (
    trim(process.env.NEXT_PUBLIC_SITE_URL) ||
    trim(process.env.SITE_URL) ||
    (process.env.NODE_ENV === 'production' ? PRODUCTION_SITE_URL : 'http://localhost:3000')
  )
}

export function resolveApiUrl(): string {
  return (
    trim(process.env.API_URL) ||
    trim(process.env.NEXT_PUBLIC_API_URL) ||
    (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : 'http://localhost:4000')
  )
}

export function resolveAllowedOrigins(): string[] {
  const fromEnv = trim(process.env.CORS_ORIGINS)
  const defaults = [
    PRODUCTION_SITE_URL,
    PRODUCTION_ADMIN_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ]
  if (!fromEnv) return defaults
  return [...new Set([...fromEnv.split(',').map((o) => trim(o)).filter(Boolean), ...defaults])]
}
