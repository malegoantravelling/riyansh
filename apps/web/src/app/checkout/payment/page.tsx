'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { CHECKOUT_SHIPPING_KEY, type ShippingDraft } from '@/lib/checkout'
import { resolveApiBase, resolveSiteOrigin } from '@/lib/apiBase'

type PayOption =
  | 'phonepe'
  | 'googlepay'
  | 'paytm'
  | 'bhim'
  | 'amazonpay'
  | 'genericintent'
  | 'creditcard'
  | 'debitcard'
  | 'netbanking'
  | 'wallets'

const UPI_OPTIONS: { id: PayOption; label: string; hint: string }[] = [
  { id: 'phonepe', label: 'PhonePe', hint: 'Opens PhonePe to complete payment' },
  { id: 'googlepay', label: 'Google Pay', hint: 'Opens Google Pay to complete payment' },
  { id: 'paytm', label: 'Paytm', hint: 'Opens Paytm to complete payment' },
  { id: 'bhim', label: 'BHIM', hint: 'Opens BHIM UPI' },
  { id: 'amazonpay', label: 'Amazon Pay', hint: 'Opens Amazon Pay UPI' },
  { id: 'genericintent', label: 'Any UPI app', hint: 'Pick from apps installed on your phone' },
]

const OTHER_OPTIONS: { id: PayOption; label: string; hint: string; enforce: string }[] = [
  {
    id: 'creditcard',
    label: 'Credit card',
    hint: 'Visa, Mastercard, RuPay and more',
    enforce: 'creditcard',
  },
  {
    id: 'debitcard',
    label: 'Debit card',
    hint: 'Pay with your bank debit card',
    enforce: 'debitcard',
  },
  {
    id: 'netbanking',
    label: 'Net banking',
    hint: 'All major Indian banks',
    enforce: 'netbanking',
  },
  {
    id: 'wallets',
    label: 'Wallets',
    hint: 'PayU wallets and cash cards (if enabled)',
    enforce: 'cashcard',
  },
]

function isMobileUa(ua: string): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
}

function isAndroidUa(ua: string): boolean {
  return /Android/i.test(ua)
}

function isIosUa(ua: string): boolean {
  return /iPhone|iPad|iPod/i.test(ua)
}

function openUpiApp(data: {
  deep_link?: string
  android_intent_url?: string | null
  ios_deep_link?: string | null
}) {
  const ua = navigator.userAgent || ''
  let url = data.deep_link || ''
  if (isAndroidUa(ua) && data.android_intent_url) {
    url = data.android_intent_url
  } else if (isIosUa(ua) && data.ios_deep_link) {
    url = data.ios_deep_link
  }
  if (!url) return false
  window.location.href = url
  return true
}

function isUpiOption(id: PayOption): boolean {
  return UPI_OPTIONS.some((o) => o.id === id)
}

export default function CheckoutPaymentPage() {
  const router = useRouter()
  const toast = useToast()
  const { items, isLoaded, syncCart } = useCart()
  const { user, accessToken, loading: authLoading } = useAuth()

  const [shipping, setShipping] = useState<ShippingDraft | null>(null)
  const [payOption, setPayOption] = useState<PayOption>('phonepe')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace('/login?next=/checkout/payment')
      return
    }
    try {
      const raw = sessionStorage.getItem(CHECKOUT_SHIPPING_KEY)
      if (!raw) {
        router.replace('/checkout')
        return
      }
      setShipping(JSON.parse(raw) as ShippingDraft)
    } catch {
      router.replace('/checkout')
    }
  }, [user, authLoading, router])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const startPayment = async () => {
    if (!accessToken || !shipping) {
      router.replace('/login?next=/checkout/payment')
      return
    }
    if (items.length === 0) {
      toast.error('Cart empty', 'Add products before payment.')
      router.push('/cart')
      return
    }

    setSubmitting(true)
    try {
      await syncCart()

      const apiBase = resolveApiBase()
      const siteUrl = resolveSiteOrigin()
      const useUpi = isUpiOption(payOption)
      const other = OTHER_OPTIONS.find((o) => o.id === payOption)

      const shipping_address = {
        firstname: shipping.firstname,
        phone: shipping.phone,
        address1: shipping.address1,
        city: shipping.city,
        state: shipping.state,
        zipcode: shipping.pincode,
        pincode: shipping.pincode,
        country: 'India',
      }

      const res = await fetch(`${apiBase}/api/orders/create-payu-order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipping_address,
          billing_address: shipping_address,
          notes: shipping.notes,
          site_url: siteUrl,
          api_base: apiBase,
          payment_method: useUpi ? 'upi_intent' : 'hosted',
          upi_app: useUpi ? payOption : undefined,
          enforce_paymethod: other?.enforce,
          device_info: navigator.userAgent,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start payment')
      }

      try {
        sessionStorage.setItem(
          'riyansh_payu_pending',
          JSON.stringify({
            order_id: data.order_id,
            txnid: data.txnid || data.fields?.txnid,
            flow: data.flow,
            at: Date.now(),
          })
        )
      } catch {
        // ignore
      }

      if (data.flow === 'upi_intent') {
        const pendingPath =
          data.pending_url ||
          `/orders/pending?order_id=${encodeURIComponent(data.order_id)}&txnid=${encodeURIComponent(data.txnid)}`

        const ua = navigator.userAgent || ''
        if (!isMobileUa(ua)) {
          toast.info(
            'Use a mobile phone',
            'UPI apps open best on Android/iOS. We will confirm payment after you pay.'
          )
        }

        openUpiApp(data)

        window.setTimeout(() => {
          if (String(pendingPath).startsWith('http')) {
            window.location.href = pendingPath
          } else {
            router.replace(pendingPath)
          }
        }, isMobileUa(ua) ? 1400 : 500)
        return
      }

      // Cards / NB / wallets: PayU collects sensitive details for this mode only (3DS).
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.payment_url
      Object.entries(data.fields || {}).forEach(([key, value]) => {
        if (key === 'drop_category' || key === 'pg') return
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = String(value ?? '')
        form.appendChild(input)
      })
      document.body.appendChild(form)
      form.submit()
    } catch (err: any) {
      console.error(err)
      toast.error('Payment failed to start', err.message || 'Please try another method.')
      setSubmitting(false)
    }
  }

  if (authLoading || !isLoaded || !shipping) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5B8C51]/20 border-t-[#5B8C51] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#787878]">Your cart is empty.</p>
        <Link href="/store">
          <Button className="bg-[#5B8C51] hover:bg-[#4E7A45]">Continue shopping</Button>
        </Link>
      </div>
    )
  }

  const selectedLabel =
    UPI_OPTIONS.find((o) => o.id === payOption)?.label ||
    OTHER_OPTIONS.find((o) => o.id === payOption)?.label ||
    'Pay'

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FAF8F2_0%,#ffffff_40%)]">
      <div className="bg-[#FAF9F5] border-b border-gray-200 py-3 text-center text-sm">
        <Link href="/cart" className="hover:text-[#5B8C51]">
          Cart
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/checkout" className="hover:text-[#5B8C51]">
          Shipping
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold">Payment</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6 bg-white border border-[#EEEEEE] p-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Payment</h1>
            <p className="mt-1 text-sm text-[#666666]">
              Choose how you want to pay. After a successful payment you will see confirmation and
              then My Orders.
            </p>
          </div>

          <div className="rounded-sm border border-[#EEEEEE] bg-[#FAF9F5] p-4 text-sm text-[#333333]">
            <p className="font-medium text-[#1A1A1A]">Deliver to</p>
            <p className="mt-1">
              {shipping.firstname} · {shipping.phone}
            </p>
            <p className="text-[#666666]">
              {shipping.address1}, {shipping.city}, {shipping.state} {shipping.pincode}
            </p>
            <Link href="/checkout" className="inline-block mt-2 text-xs text-[#5B8C51] underline">
              Edit shipping
            </Link>
          </div>

          <section className="space-y-3">
            <h2 className="text-xs font-medium uppercase tracking-wide text-[#787878]">UPI apps</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {UPI_OPTIONS.map((option) => {
                const selected = payOption === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPayOption(option.id)}
                    className={`text-left border bg-white px-3 py-3 text-sm transition-colors ${
                      selected ? 'border-[#5B8C51] ring-1 ring-[#5B8C51]' : 'border-[#EEEEEE]'
                    }`}
                  >
                    <span className="font-medium text-[#1A1A1A]">{option.label}</span>
                    <span className="block text-xs text-[#787878] mt-0.5">{option.hint}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xs font-medium uppercase tracking-wide text-[#787878]">
              Cards, net banking &amp; wallets
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {OTHER_OPTIONS.map((option) => {
                const selected = payOption === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPayOption(option.id)}
                    className={`text-left border bg-white px-3 py-3 text-sm transition-colors ${
                      selected ? 'border-[#5B8C51] ring-1 ring-[#5B8C51]' : 'border-[#EEEEEE]'
                    }`}
                  >
                    <span className="font-medium text-[#1A1A1A]">{option.label}</span>
                    <span className="block text-xs text-[#787878] mt-0.5">{option.hint}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <Button
            type="button"
            disabled={submitting}
            onClick={() => void startPayment()}
            className="w-full h-11 bg-[#5B8C51] hover:bg-[#4E7A45] text-white"
          >
            {submitting
              ? 'Starting payment…'
              : `Pay ₹${subtotal.toLocaleString('en-IN')} with ${selectedLabel}`}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#FAF9F5] border border-[#EEEEEE] p-6 h-fit">
            <h2 className="font-bold text-lg mb-4">Order summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 text-sm">
                  <div className="relative w-14 h-14 bg-white border shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-[#787878]">
                      Qty {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
