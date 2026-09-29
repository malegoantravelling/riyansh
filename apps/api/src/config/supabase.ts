import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load order: process env (Vercel) wins — dotenv does not override by default.
// __dirname = apps/api/src/config → ../../.env = apps/api/.env, ../../../.env = repo root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
// Dev: reuse web public anon key when API .env omits SUPABASE_ANON_KEY
dotenv.config({ path: path.resolve(__dirname, '../../../web/.env.local') })
dotenv.config({ path: path.resolve(__dirname, '../../../web/.env') })

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

export const supabaseUrl = cleanEnv(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
)

export const supabaseAnonKey = cleanEnv(
  process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY
)

export const supabaseServiceKey = cleanEnv(
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
)

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL on the API')
}

if (!supabaseAnonKey && !supabaseServiceKey) {
  throw new Error(
    'Missing SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY on the API. Set at least the anon key (same as the web app).'
  )
}

const servicePayload = supabaseServiceKey ? decodeJwtPayload(supabaseServiceKey) : null
export const supabaseProjectRef =
  typeof servicePayload?.ref === 'string' ? servicePayload.ref : null
export const supabaseKeyRole =
  typeof servicePayload?.role === 'string' ? servicePayload.role : null

if (supabaseKeyRole && supabaseKeyRole !== 'service_role') {
  console.error(
    `[supabase] WARNING: service key role is "${supabaseKeyRole}" (expected "service_role").`
  )
}

if (supabaseProjectRef && !supabaseUrl.includes(supabaseProjectRef)) {
  console.error(
    `[supabase] WARNING: SUPABASE_URL does not match key project ref "${supabaseProjectRef}".`
  )
}

/**
 * Privileged client (service role). May be unavailable if Vercel has a bad key.
 * Prefer createUserClient() for end-user cart/checkout flows.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

/** Anon client — used to validate user JWTs (does not need service_role). */
export function createAnonClient(): SupabaseClient {
  if (!supabaseAnonKey) {
    throw new Error('Missing SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) on the API')
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * User-scoped client: RLS applies as the logged-in shopper.
 * This is the permanent path when service_role on Vercel is wrong/missing.
 */
export function createUserClient(accessToken: string): SupabaseClient {
  if (!supabaseAnonKey) {
    throw new Error('Missing SUPABASE_ANON_KEY on the API')
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function probeSupabase(): Promise<{
  ok: boolean
  error?: string
  role: string | null
  ref: string | null
  urlHost: string
  anonConfigured: boolean
  serviceConfigured: boolean
  anonOk?: boolean
  serviceOk?: boolean
}> {
  const urlHost = (() => {
    try {
      return new URL(supabaseUrl).host
    } catch {
      return 'invalid-url'
    }
  })()

  let serviceOk = false
  let anonOk = false
  let error: string | undefined

  if (supabaseServiceKey) {
    const admin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { error: serviceError } = await admin.from('products').select('id').limit(1)
    serviceOk = !serviceError
    if (serviceError) error = `service_role: ${serviceError.message}`
  }

  if (supabaseAnonKey) {
    const anon = createAnonClient()
    const { error: anonError } = await anon.from('products').select('id').limit(1)
    anonOk = !anonError
    if (anonError) error = error ? `${error}; anon: ${anonError.message}` : `anon: ${anonError.message}`
  }

  const ok = serviceOk || anonOk
  return {
    ok,
    error: ok ? undefined : error || 'No working Supabase key',
    role: supabaseKeyRole,
    ref: supabaseProjectRef,
    urlHost,
    anonConfigured: Boolean(supabaseAnonKey),
    serviceConfigured: Boolean(supabaseServiceKey),
    anonOk,
    serviceOk,
  }
}
