function isPrivateOrLanHost(host: string): boolean {
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  return false
}

/** Local/LAN: follow browser hostname. Production: keep VITE_API_URL as-is. */
export function resolveApiUrl(): string {
  const configured = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')
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

const getToken = () => localStorage.getItem('admin_token')

const handleResponse = async (response: Response) => {
  const text = await response.text()
  let data: any = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(text?.slice(0, 200) || `Invalid JSON response (HTTP ${response.status})`)
  }

  if (!response.ok) {
    throw new Error(data?.error || `HTTP error! status: ${response.status}`)
  }

  return data
}

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  async delete(endpoint: string) {
    const response = await fetch(`${resolveApiUrl()}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(response)
  },
}
