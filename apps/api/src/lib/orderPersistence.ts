import { supabase } from '../config/supabase'

type ShippingLike = {
  firstname?: string
  phone?: string
  address1?: string
  city?: string
  state?: string
  pincode?: string
  zipcode?: string
  notes?: string
  _payment_method?: string
  preferred_upi_app?: string
}

/** Upsert the user's default saved address from a checkout shipping payload. */
export async function saveDefaultUserAddress(
  userId: string,
  shipping: ShippingLike | null | undefined,
  opts?: { preferredUpiApp?: string | null; notes?: string | null }
) {
  if (!userId || !shipping?.address1 || !shipping?.city || !shipping?.state) return

  const zip = String(shipping.zipcode || shipping.pincode || '').trim()
  if (!zip) return

  const preferredUpi =
    opts?.preferredUpiApp ||
    (typeof shipping._payment_method === 'string' && shipping._payment_method.startsWith('upi_intent:')
      ? shipping._payment_method.replace('upi_intent:', '')
      : shipping.preferred_upi_app) ||
    null

  const row = {
    user_id: userId,
    full_name: String(shipping.firstname || '').trim() || null,
    phone: String(shipping.phone || '').trim() || null,
    address_line_1: String(shipping.address1).trim(),
    address_line_2: null as string | null,
    street_address: String(shipping.address1).trim(),
    city: String(shipping.city).trim(),
    state: String(shipping.state).trim(),
    zip_code: zip,
    notes: opts?.notes != null ? String(opts.notes) : shipping.notes || null,
    preferred_upi_app: preferredUpi,
    is_default: true,
    updated_at: new Date().toISOString(),
  }

  // Clear previous defaults, then insert a new default (simple + reliable).
  await supabase.from('user_addresses').update({ is_default: false }).eq('user_id', userId)

  const { data: existing } = await supabase
    .from('user_addresses')
    .select('id')
    .eq('user_id', userId)
    .eq('address_line_1', row.address_line_1)
    .eq('zip_code', row.zip_code)
    .maybeSingle()

  if (existing?.id) {
    await supabase.from('user_addresses').update(row).eq('id', existing.id)
  } else {
    await supabase.from('user_addresses').insert(row)
  }
}

export function addressRowToShippingDraft(row: any) {
  if (!row) return null
  return {
    firstname: row.full_name || '',
    phone: row.phone || '',
    address1: row.address_line_1 || row.street_address || '',
    city: row.city || '',
    state: row.state || '',
    pincode: row.zip_code || '',
    notes: row.notes || '',
    preferred_upi_app: row.preferred_upi_app || null,
  }
}

/** Persist PayU (or failed) transaction; works with nullable Razorpay legacy columns. */
export async function insertPayUTransaction(payload: {
  userId: string
  orderId: string
  amount: number | string
  status: string
  txnid?: string | null
  mihpayid?: string | null
  mode?: string | null
  paymentMethod?: string | null
  description?: string
  raw?: Record<string, unknown> | null
  metadata?: Record<string, unknown> | null
}) {
  const { error } = await supabase.from('transactions').insert({
    user_id: payload.userId,
    order_id: payload.orderId,
    amount: payload.amount,
    currency: 'INR',
    status: payload.status,
    payment_method: payload.paymentMethod || 'PayU',
    description: payload.description || null,
    payu_txnid: payload.txnid || null,
    mihpayid: payload.mihpayid || null,
    mode: payload.mode || null,
    raw_response: payload.raw || null,
    metadata: payload.metadata || null,
    razorpay_order_id: null,
    razorpay_payment_id: null,
  })
  if (error) {
    console.error('Failed to create transaction:', error.message)
  }
}
