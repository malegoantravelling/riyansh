import crypto from 'crypto'
import { resolveApiUrl, resolveSiteUrl } from '../config/urls'

function trimEnv(value: string | undefined): string {
  return (value || '').trim()
}

export type PayUMode = 'test' | 'production'

const TEST_BASE_URL = 'https://test.payu.in'
const PRODUCTION_BASE_URL = 'https://secure.payu.in'

function resolvePayUMode(): PayUMode {
  const explicit = trimEnv(process.env.PAYU_MODE).toLowerCase()
  if (explicit === 'production' || explicit === 'live') return 'production'
  if (explicit === 'test') return 'test'

  const baseUrl = trimEnv(process.env.PAYU_BASE_URL).toLowerCase()
  if (baseUrl.includes('secure.payu.in')) return 'production'
  return 'test'
}

function resolveBaseUrl(mode: PayUMode): string {
  const configured = trimEnv(process.env.PAYU_BASE_URL)
  if (configured) {
    const lower = configured.toLowerCase()
    if (mode === 'test' && lower.includes('secure.payu.in')) {
      throw new Error(
        'PayU misconfiguration: PAYU_MODE=test requires https://test.payu.in, not secure.payu.in. ' +
          'Use Test Mode key/salt from PayU Dashboard (Developer → API Keys).'
      )
    }
    if (mode === 'production' && lower.includes('test.payu.in')) {
      throw new Error(
        'PayU misconfiguration: PAYU_MODE=production requires https://secure.payu.in, not test.payu.in. ' +
          'Use Live Mode key/salt from PayU Dashboard.'
      )
    }
    return configured.replace(/\/$/, '')
  }
  return mode === 'production' ? PRODUCTION_BASE_URL : TEST_BASE_URL
}

export function getPayUConfig() {
  const mode = resolvePayUMode()
  const key = trimEnv(process.env.PAYU_KEY)
  const salt = trimEnv(process.env.PAYU_SALT)
  const baseUrl = resolveBaseUrl(mode)
  const surl = trimEnv(process.env.PAYU_SURL)
  const furl = trimEnv(process.env.PAYU_FURL)
  const siteUrl = resolveSiteUrl()

  if (!key || !salt) {
    throw new Error('PAYU_KEY and PAYU_SALT must be configured')
  }
  if (!surl || !furl) {
    throw new Error('PAYU_SURL and PAYU_FURL must be configured')
  }

  return {
    mode,
    key,
    salt,
    baseUrl,
    paymentUrl: `${baseUrl}/_payment`,
    surl,
    furl,
    siteUrl,
  }
}

export interface PayUHashParams {
  key: string
  txnid: string
  amount: string
  productinfo: string
  firstname: string
  email: string
  udf1?: string
  udf2?: string
  udf3?: string
  udf4?: string
  udf5?: string
  salt: string
}

/** Request hash: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT) */
export function generatePaymentHash(params: PayUHashParams): string {
  const parts = [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || '',
    params.udf2 || '',
    params.udf3 || '',
    params.udf4 || '',
    params.udf5 || '',
    '',
    '',
    '',
    '',
    '',
    params.salt,
  ]
  return crypto.createHash('sha512').update(parts.join('|')).digest('hex')
}

export interface PayUCallbackFields {
  key?: string
  txnid?: string
  amount?: string
  productinfo?: string
  firstname?: string
  email?: string
  status?: string
  hash?: string
  udf1?: string
  udf2?: string
  udf3?: string
  udf4?: string
  udf5?: string
  additionalCharges?: string
}

/**
 * Reverse hash:
 * sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * With additionalCharges: sha512(additionalCharges|SALT|status|...)
 */
export function verifyReverseHash(fields: PayUCallbackFields, salt: string): boolean {
  if (!fields.hash || !fields.status || !fields.txnid || !fields.key) {
    return false
  }

  const udf1 = fields.udf1 || ''
  const udf2 = fields.udf2 || ''
  const udf3 = fields.udf3 || ''
  const udf4 = fields.udf4 || ''
  const udf5 = fields.udf5 || ''
  const email = fields.email || ''
  const firstname = fields.firstname || ''
  const productinfo = fields.productinfo || ''
  const amount = fields.amount || ''

  let hashString = `${salt}|${fields.status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${fields.txnid}|${fields.key}`

  if (fields.additionalCharges) {
    hashString = `${fields.additionalCharges}|${hashString}`
  }

  const expected = crypto.createHash('sha512').update(hashString).digest('hex')
  return expected.toLowerCase() === fields.hash.toLowerCase()
}

export function formatPayUAmount(amount: number): string {
  return Number(amount).toFixed(2)
}

export function generateTxnId(): string {
  return `RYN${Date.now()}${crypto.randomBytes(3).toString('hex')}`
}

export function getPayUInfoUrl(mode: PayUMode = resolvePayUMode()): string {
  return mode === 'production'
    ? 'https://info.payu.in/merchant/postservice.php?form=2'
    : 'https://test.payu.in/merchant/postservice.php?form=2'
}

export function generateCommandHash(key: string, command: string, var1: string, salt: string): string {
  return crypto.createHash('sha512').update(`${key}|${command}|${var1}|${salt}`).digest('hex')
}

export function isPayUSuccessStatus(status: string | undefined | null): boolean {
  const s = String(status || '').toLowerCase()
  return s === 'success' || s === 'captured'
}

export function isPayUPendingStatus(status: string | undefined | null): boolean {
  const s = String(status || '').toLowerCase()
  return s === 'pending' || s === 'in progress' || s === 'initiated' || s === 'auth'
}

export interface PayUVerifiedTxn {
  txnid: string
  status: string
  unmappedstatus?: string
  mihpayid?: string
  mode?: string
  amount?: string
  bank_ref_num?: string
  error_Message?: string
  udf1?: string
  raw: Record<string, unknown>
}

/** Checkout UPI apps we expose on the merchant site (PayU upiAppName enums). */
export type PayUUpiApp =
  | 'phonepe'
  | 'googlepay'
  | 'paytm'
  | 'bhim'
  | 'amazonpay'
  | 'genericintent'

export const PAYU_UPI_APPS: readonly PayUUpiApp[] = [
  'phonepe',
  'googlepay',
  'paytm',
  'bhim',
  'amazonpay',
  'genericintent',
] as const

const UPI_ANDROID_PACKAGES: Record<PayUUpiApp, string | null> = {
  phonepe: 'com.phonepe.app',
  googlepay: 'com.google.android.apps.nbu.paisa.user',
  paytm: 'net.one97.paytm',
  bhim: 'in.org.npci.upiapp',
  amazonpay: 'in.amazon.mShop.android.shopping',
  genericintent: null,
}

const UPI_IOS_SCHEMES: Record<PayUUpiApp, string | null> = {
  phonepe: 'phonepe://upi/pay?',
  googlepay: 'gpay://upi/pay?',
  paytm: 'paytmmp://upi/pay?',
  bhim: 'bhim://upi/pay?',
  amazonpay: null,
  genericintent: null,
}

export function isPayUUpiApp(value: unknown): value is PayUUpiApp {
  return typeof value === 'string' && (PAYU_UPI_APPS as readonly string[]).includes(value)
}

export interface PayUUpiIntentRequest {
  txnid: string
  amount: string
  productinfo: string
  firstname: string
  lastname?: string
  email: string
  phone: string
  surl: string
  furl: string
  udf1?: string
  address1?: string
  city?: string
  state?: string
  country?: string
  zipcode?: string
  upiApp: PayUUpiApp
  clientIp: string
  deviceInfo: string
}

export interface PayUUpiIntentResult {
  txnid: string
  paymentId?: string
  intentUriData: string
  /** Generic NPCI deep link */
  deepLink: string
  /** Prefer on Android Chrome for a specific app */
  androidIntentUrl: string | null
  /** Prefer on iOS Safari for a specific app */
  iosDeepLink: string | null
  acsTemplateHtml: string | null
  raw: Record<string, unknown>
}

function normalizeIntentUriData(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('upi://pay?')) return trimmed.slice('upi://pay?'.length)
  if (trimmed.startsWith('upi://pay')) return trimmed.slice('upi://pay'.length).replace(/^\?/, '')
  if (trimmed.startsWith('?')) return trimmed.slice(1)
  return trimmed
}

export function buildUpiDeepLinks(intentUriData: string, upiApp: PayUUpiApp) {
  const data = normalizeIntentUriData(intentUriData)
  const deepLink = `upi://pay?${data}`
  const androidPackage = UPI_ANDROID_PACKAGES[upiApp]
  const iosScheme = UPI_IOS_SCHEMES[upiApp]

  return {
    deepLink,
    androidIntentUrl: androidPackage
      ? `intent://pay?${data}#Intent;scheme=upi;package=${androidPackage};end`
      : null,
    iosDeepLink: iosScheme ? `${iosScheme}${data}` : null,
  }
}

/**
 * PayU S2S UPI Intent (txn_s2s_flow=4). Returns deep-link payload to open PhonePe / GPay / etc.
 * Docs: https://docs.payu.in/docs/upi-intent-server-to-server
 */
export async function initiatePayUUpiIntent(
  params: PayUUpiIntentRequest
): Promise<PayUUpiIntentResult> {
  const payu = getPayUConfig()
  const hash = generatePaymentHash({
    key: payu.key,
    txnid: params.txnid,
    amount: params.amount,
    productinfo: params.productinfo,
    firstname: params.firstname,
    email: params.email,
    udf1: params.udf1 || '',
    salt: payu.salt,
  })

  const body = new URLSearchParams({
    key: payu.key,
    txnid: params.txnid,
    amount: params.amount,
    productinfo: params.productinfo,
    firstname: params.firstname,
    lastname: params.lastname || 'Customer',
    email: params.email,
    phone: params.phone,
    surl: params.surl,
    furl: params.furl,
    hash,
    udf1: params.udf1 || '',
    udf2: '',
    udf3: '',
    udf4: '',
    udf5: '',
    address1: params.address1 || '',
    city: params.city || '',
    state: params.state || '',
    country: params.country || 'India',
    zipcode: params.zipcode || '',
    pg: 'UPI',
    bankcode: 'INTENT',
    upiAppName: params.upiApp,
    txn_s2s_flow: '4',
    s2s_client_ip: params.clientIp || '127.0.0.1',
    s2s_device_info: params.deviceInfo.slice(0, 512) || 'Mozilla/5.0',
  })

  const response = await fetch(payu.paymentUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
  })

  const text = await response.text()
  let json: any
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(
      `PayU UPI Intent returned non-JSON (${response.status}): ${text.slice(0, 240)}`
    )
  }

  const meta = json?.metaData || json?.metadata || {}
  const result = json?.result || {}
  const intentUriData = String(result.intentURIData || result.intentUriData || '').trim()
  const txnStatus = String(meta.txnStatus || meta.unmappedStatus || '').toLowerCase()

  if (!intentUriData) {
    const message =
      meta.message ||
      json?.message ||
      json?.error ||
      `PayU UPI Intent failed (status=${txnStatus || response.status})`
    throw new Error(String(message))
  }

  const links = buildUpiDeepLinks(intentUriData, params.upiApp)
  let acsTemplateHtml: string | null = null
  if (result.acsTemplate) {
    try {
      acsTemplateHtml = Buffer.from(String(result.acsTemplate), 'base64').toString('utf8')
    } catch {
      acsTemplateHtml = null
    }
  }

  return {
    txnid: params.txnid,
    paymentId: result.paymentId ? String(result.paymentId) : undefined,
    intentUriData,
    deepLink: links.deepLink,
    androidIntentUrl: links.androidIntentUrl,
    iosDeepLink: links.iosDeepLink,
    acsTemplateHtml,
    raw: json,
  }
}

/** Verify txn status with PayU (needed when UPI Intent never redirects back). */
export async function verifyPayUPayment(txnid: string): Promise<PayUVerifiedTxn | null> {
  const payu = getPayUConfig()
  const command = 'verify_payment'
  const hash = generateCommandHash(payu.key, command, txnid, payu.salt)
  const body = new URLSearchParams({
    key: payu.key,
    command,
    var1: txnid,
    hash,
  })

  const response = await fetch(getPayUInfoUrl(payu.mode), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const text = await response.text()
  let json: any
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`PayU verify_payment returned non-JSON: ${text.slice(0, 200)}`)
  }

  const details = json?.transaction_details?.[txnid]
  if (!details) {
    return null
  }

  return {
    txnid,
    status: String(details.status || ''),
    unmappedstatus: details.unmappedstatus ? String(details.unmappedstatus) : undefined,
    mihpayid: details.mihpayid ? String(details.mihpayid) : undefined,
    mode: details.mode ? String(details.mode) : undefined,
    amount: details.amt || details.transaction_amount || details.amount,
    bank_ref_num: details.bank_ref_num ? String(details.bank_ref_num) : undefined,
    error_Message: details.error_Message ? String(details.error_Message) : undefined,
    udf1: details.udf1 ? String(details.udf1) : undefined,
    raw: details,
  }
}
