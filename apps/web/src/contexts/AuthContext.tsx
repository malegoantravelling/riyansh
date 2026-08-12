'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { resolveApiBase } from '@/lib/apiBase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  accessToken: string | null
  getAccessToken: () => Promise<string | null>
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithPassword: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>
  signInWithGoogle: (next?: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  ensureProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/** Prevents overlapping ensure-profile calls (getSession + onAuthStateChange). */
let ensuringProfile = false

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const getAccessToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    let next = data.session
    const expiresAtMs = (next?.expires_at ?? 0) * 1000
    const needsRefresh = !next || expiresAtMs < Date.now() + 60_000
    if (needsRefresh) {
      const refreshed = await supabase.auth.refreshSession()
      next = refreshed.data.session ?? next
      if (refreshed.data.session) {
        setSession(refreshed.data.session)
        setUser(refreshed.data.session.user)
      }
    }
    return next?.access_token ?? null
  }, [supabase])

  const ensureProfile = useCallback(async () => {
    if (ensuringProfile) return
    const token = await getAccessToken()
    if (!token) return

    ensuringProfile = true
    try {
      const res = await fetch(`${resolveApiBase()}/api/users/ensure`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      if (!res.ok) {
        return
      }
    } catch {
      // Soft-fail network blips (common during navigation / API restart).
    } finally {
      ensuringProfile = false
    }
  }, [getAccessToken])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
      if (data.session) {
        void ensureProfile()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
      if (nextSession) {
        void ensureProfile()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase, ensureProfile])

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signUpWithPassword = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, name: fullName },
      },
    })
    return { error: error?.message ?? null }
  }

  const signInWithGoogle = async (next = '/') => {
    const origin = window.location.origin
    // Custom OIDC provider in Supabase: identifier must be exactly "custom:google"
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'custom:google' as 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        accessToken: session?.access_token ?? null,
        getAccessToken,
        signInWithPassword,
        signUpWithPassword,
        signInWithGoogle,
        signOut,
        ensureProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
