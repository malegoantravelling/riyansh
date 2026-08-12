import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load order: process env (Vercel) wins — dotenv does not override by default.
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

function cleanEnv(value: string | undefined): string {
  return (value || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/\r?\n/g, '')
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const json = Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString(
      'utf8'
    )
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

const supabaseUrl = cleanEnv(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseKey = cleanEnv(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
)

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the API. Set them in Vercel → Project → Settings → Environment Variables.'
  )
}

const payload = decodeJwtPayload(supabaseKey)
const keyRole = typeof payload?.role === 'string' ? payload.role : null
const keyRef = typeof payload?.ref === 'string' ? payload.ref : null

if (keyRole && keyRole !== 'service_role') {
  console.error(
    `[supabase] WARNING: key role is "${keyRole}" (expected "service_role"). Admin/cart FK writes will fail.`
  )
}

if (keyRef && !supabaseUrl.includes(keyRef)) {
  console.error(
    `[supabase] WARNING: SUPABASE_URL does not match key project ref "${keyRef}". This causes "Invalid API key".`
  )
}

export const supabaseProjectRef = keyRef
export const supabaseKeyRole = keyRole

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

/** Lightweight readiness check used by /health/supabase */
export async function probeSupabase(): Promise<{
  ok: boolean
  error?: string
  role: string | null
  ref: string | null
  urlHost: string
}> {
  const urlHost = (() => {
    try {
      return new URL(supabaseUrl).host
    } catch {
      return 'invalid-url'
    }
  })()

  try {
    const { error } = await supabase.from('products').select('id').limit(1)
    if (error) {
      return { ok: false, error: error.message, role: keyRole, ref: keyRef, urlHost }
    }
    return { ok: true, role: keyRole, ref: keyRef, urlHost }
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Supabase probe failed',
      role: keyRole,
      ref: keyRef,
      urlHost,
    }
  }
}
