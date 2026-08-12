/**
 * Upsert critical Supabase keys onto Vercel project riyansh-api via REST API.
 *
 * Usage (PowerShell):
 *   $env:VERCEL_TOKEN = "vercel_xxx"
 *   node scripts/fix-vercel-supabase-env.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ID = 'prj_evTdSgyUrnm4HszXbOttJnuj4X8h'
const TEAM_ID = 'team_yf8UenRqEOJ3H9NhkbOaOq3A'
const ROOT = path.resolve(__dirname, '..')

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const out = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 1) continue
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    out[t.slice(0, i).trim()] = v.replace(/\r?\n/g, '').trim()
  }
  return out
}

function loadLocalEnv() {
  return {
    ...parseEnvFile(path.join(ROOT, '.env')),
    ...parseEnvFile(path.join(ROOT, 'apps', 'api', '.env')),
    ...parseEnvFile(path.join(ROOT, 'apps', 'web', '.env.local')),
  }
}

async function upsertEnv(token, key, value, targets) {
  const url = `https://api.vercel.com/v10/projects/${PROJECT_ID}/env?upsert=true&teamId=${TEAM_ID}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      value,
      type: 'encrypted',
      target: targets,
    }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${key}: ${res.status} ${text}`)
  }
  console.log(`upserted ${key} -> ${targets.join(',')}`)
}

async function redeployProduction(token) {
  const listUrl = `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&teamId=${TEAM_ID}&limit=1&target=production`
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const list = await listRes.json()
  const latestId = list?.deployments?.[0]?.uid
  if (!latestId) {
    console.warn('Could not find latest deployment to redeploy — redeploy manually in Vercel dashboard.')
    return
  }

  const redeployUrl = `https://api.vercel.com/v13/deployments?teamId=${TEAM_ID}`
  const res = await fetch(redeployUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deploymentId: latestId,
      name: 'riyansh-api',
      target: 'production',
    }),
  })
  const text = await res.text()
  if (!res.ok) {
    console.warn('Redeploy API failed:', res.status, text)
    console.warn('Redeploy manually: Vercel -> riyansh-api -> Deployments -> Redeploy')
    return
  }
  console.log('Triggered production redeploy:', latestId)
}

async function main() {
  const token = (process.env.VERCEL_TOKEN || process.env.VERCEL_ACCESS_TOKEN || '').trim()
  if (!token) {
    console.error('Missing VERCEL_TOKEN')
    process.exit(1)
  }

  const env = loadLocalEnv()
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const anon =
    env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY
  const service = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY

  if (!url || !anon) {
    console.error('Local env missing SUPABASE_URL / anon key')
    process.exit(1)
  }

  const targets = ['production', 'preview']
  await upsertEnv(token, 'SUPABASE_URL', url, targets)
  await upsertEnv(token, 'SUPABASE_ANON_KEY', anon, targets)
  await upsertEnv(token, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', anon, targets)
  if (service) {
    await upsertEnv(token, 'SUPABASE_SERVICE_ROLE_KEY', service, targets)
    await upsertEnv(token, 'SUPABASE_KEY', service, targets)
  }

  await upsertEnv(token, 'SITE_URL', 'https://riyanshamrit.com', targets)
  await upsertEnv(
    token,
    'PAYU_SURL',
    'https://riyansh-api.vercel.app/api/orders/payu/success',
    ['production']
  )
  await upsertEnv(
    token,
    'PAYU_FURL',
    'https://riyansh-api.vercel.app/api/orders/payu/failure',
    ['production']
  )

  const optionalKeys = [
    'PAYU_MODE',
    'PAYU_KEY',
    'PAYU_SALT',
    'PAYU_BASE_URL',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'ADMIN_API_TOKEN',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'CORS_ORIGINS',
  ]
  for (const key of optionalKeys) {
    if (env[key]) {
      await upsertEnv(token, key, env[key], targets)
    }
  }

  console.log('\nEnv updated. Redeploying production...')
  await redeployProduction(token)
  console.log('\nAfter deploy finishes, check: https://riyansh-api.vercel.app/health/supabase')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
