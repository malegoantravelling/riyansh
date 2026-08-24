'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { CHECKOUT_SHIPPING_KEY } from '@/lib/checkout'

function SuccessContent() {
  const router = useRouter()
  const params = useSearchParams()
  const orderId = params.get('order_id')
  const txnid = params.get('txnid')
  const { clearCart } = useCart()
  const [seconds, setSeconds] = useState(4)
  const cleared = useRef(false)

  useEffect(() => {
    if (cleared.current) return
    cleared.current = true
    clearCart()
    try {
      sessionStorage.removeItem('riyansh_payu_pending')
      sessionStorage.removeItem(CHECKOUT_SHIPPING_KEY)
    } catch {
      // ignore
    }
  }, [clearCart])

  useEffect(() => {
    if (seconds <= 0) {
      router.replace('/account/orders')
      return
    }
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearTimeout(t)
  }, [seconds, router])

  return (
    <div className="page-shell surface-band flex min-h-[60vh] items-center justify-center px-4">
      <div className="surface-glass w-full max-w-md rounded-2xl p-8 text-center">
        <CheckCircle2 className="h-14 w-14 text-[#013220] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#013220]">Payment successful</h1>
        <p className="mt-2 text-sm text-[#80866e]">
          Thank you for your order. We have received your PayU payment.
        </p>
        {orderId && (
          <p className="mt-4 text-xs text-[#80866e]">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}
        {txnid && (
          <p className="text-xs text-[#80866e]">
            Transaction: <span className="font-mono">{txnid}</span>
          </p>
        )}
        <p className="mt-3 text-xs text-[#80866e]">Redirecting to My Orders in {seconds}s…</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders">
            <Button className="bg-[#013220] hover:bg-[#012418] w-full">My Orders</Button>
          </Link>
          <Link href="/store">
            <Button variant="outline" className="w-full">
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading…</div>}
    >
      <SuccessContent />
    </Suspense>
  )
}
