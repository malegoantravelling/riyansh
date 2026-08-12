import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'

export type AuthUserLike = {
  id?: string
  email?: string | null
  user_metadata?: Record<string, any> | null
}

/**
 * Ensures a row exists in public.users (required by cart/wishlist/orders FKs).
 * Prefers the user-scoped client (RLS) so checkout works without service_role.
 */
export async function ensurePublicUser(
  authUser: AuthUserLike | null | undefined,
  userClient?: SupabaseClient | null
) {
  const userId = authUser?.id
  if (!userId) {
    return { user: null as null, error: 'Missing auth user id' }
  }

  let email = (authUser.email || '').trim()
  let meta = authUser.user_metadata || {}
  const db = userClient || supabase

  if (!email && userClient) {
    const { data, error } = await userClient.auth.getUser()
    if (!error && data.user?.email) {
      email = data.user.email.trim()
      meta = { ...meta, ...(data.user.user_metadata || {}) }
    }
  }

  if (!email) {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(userId)
      if (!error && data.user?.email) {
        email = data.user.email.trim()
        meta = { ...meta, ...(data.user.user_metadata || {}) }
      } else if (error && /invalid api key/i.test(error.message)) {
        return {
          user: null as null,
          error:
            'Invalid API key: set SUPABASE_ANON_KEY on the API (same as web) and redeploy. service_role is optional for checkout.',
        }
      }
    } catch {
      // ignore
    }
  }

  if (!email) {
    return {
      user: null as null,
      error:
        'Auth user has no email. Sign out and sign in again, and set SUPABASE_ANON_KEY on the API.',
    }
  }

  const row = {
    id: userId,
    email,
    full_name: meta.full_name || meta.name || email.split('@')[0],
    avatar_url: meta.avatar_url || meta.picture || null,
  }

  const { data, error } = await db.from('users').upsert(row, { onConflict: 'id' }).select().single()

  if (error) {
    if (userClient) {
      const second = await supabase.from('users').upsert(row, { onConflict: 'id' }).select().single()
      if (!second.error && second.data) {
        return { user: second.data, error: null as null }
      }
      if (second.error && /invalid api key/i.test(second.error.message)) {
        return {
          user: null as null,
          error:
            'Invalid API key on API server. Set SUPABASE_ANON_KEY (required) and SUPABASE_SERVICE_ROLE_KEY on Vercel riyansh-api, then redeploy.',
        }
      }
      return { user: null as null, error: second.error?.message || error.message }
    }
    if (/invalid api key/i.test(error.message)) {
      return {
        user: null as null,
        error:
          'Invalid API key on API server. Set SUPABASE_ANON_KEY (required) and SUPABASE_SERVICE_ROLE_KEY on Vercel riyansh-api, then redeploy.',
      }
    }
    return { user: null as null, error: error.message }
  }

  return { user: data, error: null as null }
}
