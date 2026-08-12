import { supabase } from '../config/supabase'

export type AuthUserLike = {
  id?: string
  email?: string | null
  user_metadata?: Record<string, any> | null
}

/**
 * Ensures a row exists in public.users (required by cart/wishlist/orders FKs).
 * Resolves email from the JWT user, metadata, or Auth Admin API when missing.
 */
export async function ensurePublicUser(authUser: AuthUserLike | null | undefined) {
  const userId = authUser?.id
  if (!userId) {
    return { user: null as null, error: 'Missing auth user id' }
  }

  let email = (authUser.email || '').trim()
  let meta = authUser.user_metadata || {}

  if (!email) {
    const { data, error } = await supabase.auth.admin.getUserById(userId)
    if (error || !data.user) {
      return {
        user: null as null,
        error: error?.message || 'Could not load auth user for profile ensure',
      }
    }
    email = (data.user.email || '').trim()
    meta = { ...meta, ...(data.user.user_metadata || {}) }
  }

  if (!email) {
    return { user: null as null, error: 'Auth user has no email' }
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        email,
        full_name: meta.full_name || meta.name || email.split('@')[0],
        avatar_url: meta.avatar_url || meta.picture || null,
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (error) {
    return { user: null as null, error: error.message }
  }

  return { user: data, error: null as null }
}
