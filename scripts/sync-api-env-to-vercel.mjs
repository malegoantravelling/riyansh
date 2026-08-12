/**
 * Push apps/api/.env required keys to the Vercel API project (riyansh-api).
 *
 * Prerequisites:
 *   npm i -g vercel   OR use npx
 *   npx vercel login
 *   cd apps/api && npx vercel link   (select the riyansh-api project)
 *
 * Usage:
 *   node scripts/sync-api-env-to-vercel.mjs
 */
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const ENV_PATH = path.join(ROOT, 'apps', 'api', '.env')
const API_DIR = path.join(ROOT, 'apps', 'api')

const REQUIRED = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PAYU_MODE',
  'PAYU_KEY',
  'PAYU_SALT',
  'PAYU_BASE_URL',
  'SITE_URL',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'ADMIN_API_TOKEN',
]

const OPTIONAL = ['SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'PAYU_SURL', 'PAYU_FURL', 'CORS_ORIGINS']

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${filePath}`)
  }
  const out = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

function mask(value) {
  if (!value) return '(empty)'
  if (value.length <= 10) return '***'
  return `${value.slice(0, 6)}…${value.slice(-4)} (${value.length} chars)`
}

function setVercelEnv(key, value, environment) {
  // Remove existing then add — vercel env add is interactive for existing keys.
  spawnSync('npx', ['vercel', 'env', 'rm', key, environment, '-y'], {
    cwd: API_DIR,
    encoding: 'utf8',
    shell: true,
  })

  const result = spawnSync('npx', ['vercel', 'env', 'add', key, environment], {
    cwd: API_DIR,
    input: value + '\n',
    encoding: 'utf8',
    shell: true,
  })

  if (result.status !== 0) {
    console.error(`Failed to set ${key} (${environment}):`, result.stderr || result.stdout)
    return false
  }
  console.log(`✓ ${key} → ${environment} (${mask(value)})`)
  return true
}

function main() {
  const env = parseEnv(ENV_PATH)
  console.log('Reading', ENV_PATH)

  const missing = REQUIRED.filter((k) => !env[k])
  if (missing.length) {
    console.error('Missing required keys in apps/api/.env:', missing.join(', '))
    console.error('Add them locally first, then re-run this script.')
    process.exit(1)
  }

  if (!fs.existsSync(path.join(API_DIR, '.vercel', 'project.json'))) {
    console.error('API project is not linked to Vercel.')
    console.error('Run: cd apps/api && npx vercel link')
    console.error('Select the project that serves https://riyansh-api.vercel.app')
    process.exit(1)
  }

  const keys = [...REQUIRED, ...OPTIONAL.filter((k) => env[k])]
  const environments = ['production', 'preview']

  let ok = true
  for (const environment of environments) {
    console.log(`\n=== ${environment} ===`)
    for (const key of keys) {
      if (!setVercelEnv(key, env[key], environment)) ok = false
    }
  }

  // Production PayU callbacks should hit the public API host.
  const prodOverrides = {
    PAYU_SURL: 'https://riyansh-api.vercel.app/api/orders/payu/success',
    PAYU_FURL: 'https://riyansh-api.vercel.app/api/orders/payu/failure',
    SITE_URL: 'https://riyanshamrit.com',
    NEXT_PUBLIC_SITE_URL: 'https://riyanshamrit.com',
  }
  console.log('\n=== production URL overrides ===')
  for (const [key, value] of Object.entries(prodOverrides)) {
    if (!setVercelEnv(key, value, 'production')) ok = false
  }

  console.log('\nDone. Redeploy the API:')
  console.log('  cd apps/api && npx vercel --prod')
  console.log('Then verify: https://riyansh-api.vercel.app/health/supabase')
  process.exit(ok ? 0 : 1)
}

main()
