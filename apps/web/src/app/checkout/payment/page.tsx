'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Check, Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { CHECKOUT_SHIPPING_KEY, type ShippingDraft } from '@/lib/checkout'
import { resolveApiBase, resolveSiteOrigin } from '@/lib/apiBase'
import {
  AmazonPayLogo,
  BankLogo,
  BhimLogo,
  CardLogo,
  GooglePayLogo,
  PaytmLogo,
  PhonePeLogo,
  UpiLogo,
  WalletLogo,
} from '@/components/PaymentMethodLogos'

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

const UPI_OPTIONS: {
  id: PayOption
  label: string
  hint: string
  Logo: typeof PhonePeLogo
}[] = [
  { id: 'phonepe', label: 'PhonePe', hint: 'Opens PhonePe to complete payment', Logo: PhonePeLogo },
  {
    id: 'googlepay',
    label: 'Google Pay',
    hint: 'Opens Google Pay to complete payment',
    Logo: GooglePayLogo,
  },
  { id: 'paytm', label: 'Paytm', hint: 'Opens Paytm to complete payment', Logo: PaytmLogo },
  { id: 'bhim', label: 'BHIM UPI', hint: 'Opens BHIM UPI', Logo: BhimLogo },
  {
    id: 'amazonpay',
    label: 'Amazon Pay',
    hint: 'Opens Amazon Pay UPI',
    Logo: AmazonPayLogo,
  },
  {
    id: 'genericintent',
    label: 'Any UPI app',
    hint: 'Choose from apps installed on your phone',
    Logo: UpiLogo,
  },
]

const OTHER_OPTIONS: {
  id: PayOption
  label: string
  hint: string
  enforce: string
  Logo: typeof CardLogo
}[] = [
  {
    id: 'creditcard',
    label: 'Credit card',
    hint: 'Visa, Mastercard, RuPay and more',
    enforce: 'creditcard',
    Logo: CardLogo,
  },
  {
    id: 'debitcard',
    label: 'Debit card',
    hint: 'Pay with your bank debit card',
    enforce: 'debitcard',
    Logo: CardLogo,
  },
  {
    id: 'netbanking',
    label: 'Net banking',
    hint: 'All major Indian banks',
    enforce: 'netbanking',
    Logo: BankLogo,
  },
  {
    id: 'wallets',
    label: 'Wallets',
    hint: 'PayU wallets and cash cards',
    enforce: 'cashcard',
    Logo: WalletLogo,
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

function PayOptionButton({
  selected,
  label,
  hint,
  Logo,
  onSelect,
}: {
  selected: boolean
  label: string
  hint: string
  Logo: typeof PhonePeLogo
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative flex w-full items-center gap-3 rounded-2xl border bg-white px-3.5 py-3.5 text-left transition-all ${
        selected
          ? 'border-[#5B8C51] shadow-[0_0_0_1px_#5B8C51,0_10px_24px_rgba(91,140,81,0.12)]'
          : 'border-[#E8E4DA] hover:border-[#C9D9C4] hover:bg-[#FCFAF5]'
      }`}
    >
      <span className="shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
        <Logo className="h-11 w-11" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-[#1A1A1A]">{label}</span>
        <span className="mt-0.5 block text-xs leading-snug text-[#7A7A7A]">{hint}</span>
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected ? 'border-[#5B8C51] bg-[#5B8C51] text-white' : 'border-[#D6D6D6] bg-white'
        }`}
        aria-hidden="true"
      >
        {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
    </button>
  )
}

export default function CheckoutPaymentPage() {
  const router = useRouter()
  const toast = useToast()
  const { items, isLoaded, syncCart } = useCart()
  const { user, getAccessToken, signOut, loading: authLoading } = useAuth()

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
      const draft = JSON.parse(raw) as ShippingDraft
      setShipping(draft)
      const preferred = draft.preferred_upi_app
      if (
        preferred === 'phonepe' ||
        preferred === 'googlepay' ||
        preferred === 'paytm' ||
        preferred === 'bhim' ||
        preferred === 'amazonpay' ||
        preferred === 'genericintent'
      ) {
        setPayOption(preferred)
      }
    } catch {
      router.replace('/checkout')
    }
  }, [user, authLoading, router])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const requireFreshLogin = async (message: string) => {
    toast.error('Session expired', message)
    try {
      await signOut()
    } catch {
      // ignore
    }
    router.replace('/login?next=/checkout/payment')
  }

  const startPayment = async () => {
    if (!shipping) {
      router.replace('/checkout')
      return
    }

    const token = await getAccessToken({ forceRefresh: true })
    if (!token) {
      await requireFreshLogin('Please sign in again to pay.')
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

      const postOrder = (authToken: string) =>
        fetch(`${apiBase}/api/orders/create-payu-order`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
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
            items: items.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
            })),
          }),
        })

      let authToken = token
      let res = await postOrder(authToken)
      if (res.status === 401) {
        const refreshed = await getAccessToken({ forceRefresh: true })
        if (!refreshed) {
          setSubmitting(false)
          await requireFreshLogin('Your login expired. Sign in again, then retry payment.')
          return
        }
        authToken = refreshed
        res = await postOrder(authToken)
      }

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 401 || data.code === 'auth_token_invalid') {
          setSubmitting(false)
          await requireFreshLogin('Your login expired. Sign in again, then retry payment.')
          return
        }
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
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Please try another method.'
      toast.error('Payment failed to start', message)
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#F4F8F1_0%,#FAF8F2_42%,#ffffff_100%)]">
      <div className="border-b border-[#E8E4DA]/80 bg-white/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-3 text-sm text-[#666666]">
          <Link href="/cart" className="hover:text-[#5B8C51]">
            Cart
          </Link>
          <span aria-hidden="true">›</span>
          <Link href="/checkout" className="hover:text-[#5B8C51]">
            Shipping
          </Link>
          <span aria-hidden="true">›</span>
          <span className="font-semibold text-[#1A1A1A]">Payment</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-5 lg:py-12">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-3xl border border-[#E8E4DA] bg-white/90 p-5 shadow-[0_16px_40px_rgba(34,34,34,0.04)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5B8C51]">
                  Secure checkout
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#1A1A1A] sm:text-3xl">
                  Choose payment
                </h1>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6B6B6B]">
                  Pay with UPI apps on your phone, or cards and net banking via PayU.
                </p>
              </div>
              <div className="hidden rounded-2xl bg-[#F3F7F1] p-3 text-[#5B8C51] sm:block">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#EFEAE0] bg-[linear-gradient(135deg,#FCFAF5,#F7FBF4)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Deliver to
                </p>
                <Link href="/checkout" className="text-xs font-semibold text-[#5B8C51] hover:underline">
                  Edit
                </Link>
              </div>
              <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">
                {shipping.firstname} · {shipping.phone}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#666666]">
                {shipping.address1}, {shipping.city}, {shipping.state} {shipping.pincode}
              </p>
            </div>

            <section className="mt-7 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#1A1A1A]">UPI apps</h2>
                <span className="rounded-full bg-[#F3F7F1] px-2.5 py-1 text-[11px] font-medium text-[#4E7A45]">
                  Recommended
                </span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {UPI_OPTIONS.map((option) => (
                  <PayOptionButton
                    key={option.id}
                    selected={payOption === option.id}
                    label={option.label}
                    hint={option.hint}
                    Logo={option.Logo}
                    onSelect={() => setPayOption(option.id)}
                  />
                ))}
              </div>
            </section>

            <section className="mt-7 space-y-3">
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Cards, net banking & wallets</h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {OTHER_OPTIONS.map((option) => (
                  <PayOptionButton
                    key={option.id}
                    selected={payOption === option.id}
                    label={option.label}
                    hint={option.hint}
                    Logo={option.Logo}
                    onSelect={() => setPayOption(option.id)}
                  />
                ))}
              </div>
            </section>

            <div className="mt-7 space-y-3">
              <Button
                type="button"
                disabled={submitting}
                onClick={() => void startPayment()}
                className="h-12 w-full rounded-2xl bg-[#5B8C51] text-base font-semibold text-white shadow-[0_12px_24px_rgba(91,140,81,0.25)] hover:bg-[#4E7A45]"
              >
                {submitting
                  ? 'Starting secure payment…'
                  : `Pay ₹${subtotal.toLocaleString('en-IN')} with ${selectedLabel}`}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-[#8A8A8A]">
                <Lock className="h-3.5 w-3.5" />
                Payments are processed securely by PayU
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-6 overflow-hidden rounded-3xl border border-[#E8E4DA] bg-white shadow-[0_16px_40px_rgba(34,34,34,0.04)]">
            <div className="border-b border-[#F0EBE1] bg-[linear-gradient(160deg,#F7FBF4,#FCFAF5)] px-5 py-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">Order summary</h2>
              <p className="mt-1 text-xs text-[#7A7A7A]">{items.length} items in your bag</p>
            </div>
            <div className="px-5 py-4">
              <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#EFEAE0] bg-[#FAF8F2]">
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
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#1A1A1A]">{item.name}</p>
                      <p className="mt-1 text-[#787878]">
                        Qty {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-2 border-t border-[#F0EBE1] pt-4 text-sm">
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Shipping</span>
                  <span className="font-medium text-[#5B8C51]">Free</span>
                </div>
                <div className="flex justify-between pt-1 text-base font-bold text-[#1A1A1A]">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
