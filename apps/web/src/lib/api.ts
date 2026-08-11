'use client'

import { useAuth } from '@/contexts/AuthContext'

const apiBase = () =>
  process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000'

export function useApiClient() {
  const { accessToken } = useAuth()

  const apiFetch = async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers)
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const res = await fetch(`${apiBase()}${path}`, {
      ...init,
      headers,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed (${res.status})`)
    }
    return data
  }

  return { apiFetch, accessToken }
}
