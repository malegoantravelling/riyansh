/**
 * Configure Google OAuth on the Supabase project via Management API.
 *
 * Requires: SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)
 * Reads Google client credentials from the client_secret*.json in repo root.
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_ACCESS_TOKEN = "sbp_..."
 *   node scripts/configure-google-auth.mjs
 */
const fs = require('fs')
const path = require('path')

const PROJECT_REF = 'iwvrjjgjxxtlvvbdbytb'
const ROOT = path.resolve(__dirname, '..')

function loadGoogleCreds() {
  const files = fs.readdirSync(ROOT).filter((f) => f.startsWith('client_secret') && f.endsWith('.json'))
  if (!files.length) {
    throw new Error('No client_secret*.json found in repo root')
  }
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, files[0]), 'utf8'))
  const web = raw.web || raw
  if (!web.client_id || !web.client_secret) {
    throw new Error('client_id / client_secret missing in Google JSON')
  }
  return web
}

async function main() {
  const token = (process.env.SUPABASE_ACCESS_TOKEN || '').trim()
  if (!token) {
    console.error('Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens')
    process.exit(1)
  }

  const google = loadGoogleCreds()
  const siteUrl = process.env.SUPABASE_SITE_URL || 'https://riyanshamrit.com'
  const body = {
    external_google_enabled: true,
    external_google_client_id: google.client_id,
    external_google_secret: google.client_secret,
    site_url: siteUrl,
    uri_allow_list: [
      'http://localhost:3000/**',
      'http://localhost:3000/auth/callback',
      'https://riyanshamrit.com/**',
      'https://riyanshamrit.com/auth/callback',
      'https://www.riyanshamrit.com/**',
      'https://www.riyanshamrit.com/auth/callback',
    ].join(','),
  }

  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  if (!res.ok) {
    console.error('Failed to update auth config:', res.status, text)
    process.exit(1)
  }

  console.log('Google OAuth enabled on Supabase project', PROJECT_REF)
  console.log('Site URL:', siteUrl)
  console.log('Redirect allow list updated for localhost and riyanshamrit.com')
  console.log('')
  console.log('To show "Riyanshamrit.com" on the Google consent screen (not *.supabase.co):')
  console.log('1. Supabase Dashboard → Project Settings → Custom Domains → add auth.riyanshamrit.com')
  console.log('2. Google Cloud Console → OAuth consent screen → App name "Riyanshamrit"')
  console.log('3. Add https://auth.riyanshamrit.com/auth/v1/callback to Google authorized redirect URIs')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
