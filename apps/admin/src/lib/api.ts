function isPrivateOrLanHost(host: string): boolean {
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  return false
}

/** Local/LAN: follow browser hostname. Production: keep VITE_API_URL as-is. */
export function resolveApiUrl(): string {
  const fallback =
    import.meta.env.PROD ? 'https://riyansh-api.vercel.app' : 'http://localhost:4000'
  const configured = (import.meta.env.VITE_API_URL || fallback).replace(/\/$/, '')
  if (typeof window === 'undefined') return configured
  try {
    const conf = new URL(configured)
    if (!isPrivateOrLanHost(conf.hostname)) return configured
    const port = conf.port || '4000'
    return `${window.location.protocol}//${window.location.hostname}:${port}`
  } catch {
    return configured
  }
}

/** @deprecated Prefer resolveApiUrl() so LAN hosts stay in sync with the page. */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const ADMIN_AUTH_EXPIRED_EVENT = 'admin-auth-expired'

const getToken = () => localStorage.getItem('admin_token')

function clearAdminSession() {
  localStorage.removeItem('admin_token')
  window.dispatchEvent(new Event(ADMIN_AUTH_EXPIRED_EVENT))
}

const authHeaders = (includeAuth: boolean): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (includeAuth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (response: Response) => {
  const text = await response.text()
  let data: any = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(text?.slice(0, 200) || `Invalid JSON response (HTTP ${response.status})`)
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 503) {
      const message = String(data?.error || '')
      if (
        message.includes('Admin access required') ||
        message.includes('Admin API is not configured') ||
        message.includes('Admin login is not configured')
      ) {
        clearAdminSession()
      }
    }
    throw new Error(data?.error || `HTTP error! status: ${response.status}`)
  }

  return data
}

export const api = {
  /** Confirms the stored admin token against a protected endpoint. */
  async validateAdminSession(): Promise<boolean> {
    const token = getToken()
    if (!token) return false
    try {
      const response = await fetch(`${resolveApiUrl()}/api/users`, {
        headers: authHeaders(true),
      })
      if (response.status === 401 || response.status === 503) {
        clearAdminSession()
        return false
      }
      return response.ok
    } catch {
      return false
    }
  },

  async get(endpoint: string) {
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      headers: authHeaders(true),
    })
    return handleResponse(response)
  },

  async post(endpoint: string, data: any) {
    const isLogin = endpoint.includes('/auth/admin/login')
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: authHeaders(!isLogin),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      method: 'PUT',
      headers: authHeaders(true),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(endpoint: string) {
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      method: 'DELETE',
      headers: authHeaders(true),
    })
    return handleResponse(response)
  },
}
