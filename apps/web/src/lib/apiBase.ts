/**
 * Shared environment helpers for localhost, LAN (e.g. 192.168.1.8), and production.
 */

const PRODUCTION_SITE_URL = 'https://riyanshamrit.com'
const PRODUCTION_API_URL = 'https://api.riyanshamrit.com'

function isLoopback(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1'
}

/** RFC1918 + common link-local ranges used for phone testing on Wi‑Fi. */
function isPrivateOrLanHost(host: string): boolean {
  if (isLoopback(host)) return true
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  return false
}

function configuredApiUrl(): string {
  const raw = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    (process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : 'http://localhost:4000')
  ).trim()
  return raw.replace(/\/$/, '')
}

/**
 * Public site origin for links / redirects.
 * In the browser, always prefer the current origin (works for localhost + LAN IP).
 * On the server, use NEXT_PUBLIC_SITE_URL / SITE_URL.
 */
export function resolveSiteOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NODE_ENV === 'production' ? PRODUCTION_SITE_URL : 'http://localhost:3000')
  ).replace(/\/$/, '')
}

/**
 * API base URL for fetch() calls.
 *
 * - Production / remote API host → use NEXT_PUBLIC_API_URL as configured
 * - Local/dev API (localhost) → rewrite host to match the page (so
 *   http://192.168.1.8:3000 talks to http://192.168.1.8:4000, not localhost)
 * - Optional: NEXT_PUBLIC_API_URL=same-origin → use window.location.origin
 */
export function resolveApiBase(): string {
  const configured = configuredApiUrl()

  if (configured === 'same-origin' || configured === '/') {
    if (typeof window !== 'undefined') return window.location.origin
    return resolveSiteOrigin()
  }

  if (typeof window === 'undefined') {
    return configured
  }

  try {
    const conf = new URL(configured)
    const pageHost = window.location.hostname
    const apiIsLocal = isPrivateOrLanHost(conf.hostname)

    // Deployed API (api.example.com, etc.): never rewrite.
    if (!apiIsLocal) {
      return configured
    }

    // Local/dev API: follow the browser hostname so phones on LAN work.
    const port = conf.port || '4000'
    return `${window.location.protocol}//${pageHost}:${port}`
  } catch {
    return configured
  }
}

export function isLanOrLocalHost(host: string): boolean {
  return isPrivateOrLanHost(host)
}
