'use client'

import { useAuth } from '@/contexts/AuthContext'
import { resolveApiBase } from '@/lib/apiBase'

export function useApiClient() {
  const { getAccessToken } = useAuth()

  const apiFetch = async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers)
    let token = await getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    let res = await fetch(`${resolveApiBase()}${path}`, {
      ...init,
      headers,
    })

    if (res.status === 401) {
      token = await getAccessToken({ forceRefresh: true })
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        res = await fetch(`${resolveApiBase()}${path}`, {
          ...init,
          headers,
        })
      }
    }

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed (${res.status})`)
    }
    return data
  }

  return { apiFetch }
}
