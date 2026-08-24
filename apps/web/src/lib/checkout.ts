export const CHECKOUT_SHIPPING_KEY = 'riyansh_checkout_shipping'

export type ShippingDraft = {
  firstname: string
  phone: string
  address1: string
  city: string
  state: string
  pincode: string
  notes: string
  preferred_upi_app?: string | null
}

export function writeCheckoutShipping(draft: ShippingDraft) {
  sessionStorage.setItem(CHECKOUT_SHIPPING_KEY, JSON.stringify(draft))
}

export function readCheckoutShipping(): ShippingDraft | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_SHIPPING_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ShippingDraft
  } catch {
    return null
  }
}

/** Prefill checkout from a previous order's shipping_address JSON. */
export function shippingFromOrderAddress(addr: any, notes = ''): ShippingDraft | null {
  if (!addr || typeof addr !== 'object') return null
  const address1 = addr.address1 || addr.address_line_1 || addr.street_address
  if (!address1) return null
  const upi =
    addr.preferred_upi_app ||
    (typeof addr._payment_method === 'string' && addr._payment_method.startsWith('upi_intent:')
      ? addr._payment_method.replace('upi_intent:', '')
      : null)
  return {
    firstname: String(addr.firstname || addr.full_name || '').trim(),
    phone: String(addr.phone || '').trim(),
    address1: String(address1).trim(),
    city: String(addr.city || '').trim(),
    state: String(addr.state || '').trim(),
    pincode: String(addr.pincode || addr.zipcode || addr.zip_code || '').trim(),
    notes: String(notes || addr.notes || '').trim(),
    preferred_upi_app: upi,
  }
}
