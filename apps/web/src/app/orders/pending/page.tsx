'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

function PendingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { accessToken, loading: authLoading } = useAuth()
  const orderId = params.get('order_id')
  const txnid = params.get('txnid')
  const [message, setMessage] = useState('Checking payment with PayU…')
  const [payuStatus, setPayuStatus] = useState<string | null>(null)
  const [stopped, setStopped] = useState(false)
  const attempts = useRef(0)

  useEffect(() => {
    if (authLoading) return
    if (!accessToken) {
      router.replace(`/login?next=${encodeURIComponent(`/orders/pending?order_id=${orderId || ''}&txnid=${txnid || ''}`)}`)
      return
    }
    if (!orderId && !txnid) {
      setMessage('Missing order details.')
      setStopped(true)
      return
    }

    let cancelled = false
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000'

    const poll = async () => {
      if (cancelled) return
      attempts.current += 1
      try {
        const res = await fetch(`${apiBase}/api/orders/payu/verify`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId, txnid }),
        })
        const data = await res.json()
        if (!res.ok) {
          setMessage(data.error || 'Could not verify payment yet.')
        } else {
          setPayuStatus(data.payu_status || data.status)
          if (data.status === 'paid') {
            router.replace(
              `/orders/success?order_id=${encodeURIComponent(data.order_id)}&txnid=${encodeURIComponent(data.txnid || txnid || '')}`
            )
            return
          }
          if (data.status === 'failed') {
            router.replace(
              `/orders/failure?order_id=${encodeURIComponent(data.order_id)}&status=${encodeURIComponent(data.payu_status || 'failed')}`
            )
            return
          }
          setMessage(
            data.unmappedstatus
              ? `PayU status: ${data.payu_status} (${data.unmappedstatus}). Waiting for bank confirmation…`
              : 'Payment is still pending at PayU. Waiting for confirmation…'
          )
        }
      } catch {
        setMessage('Network error while verifying payment. Retrying…')
      }

      if (attempts.current >= 40) {
        setStopped(true)
        setMessage(
          'Still waiting for PayU confirmation. You can tap Check payment later from My Orders.'
        )
        return
      }

      window.setTimeout(poll, 3000)
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [accessToken, authLoading, orderId, router, txnid])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-[linear-gradient(160deg,#FAF8F2,#fff)]">
      <div className="max-w-md w-full text-center bg-white border border-[#EEEEEE] p-8 shadow-sm">
        {!stopped && <Loader2 className="h-12 w-12 text-[#5B8C51] mx-auto mb-4 animate-spin" />}
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Confirming payment</h1>
        <p className="mt-2 text-sm text-[#787878]">{message}</p>
        {payuStatus && (
          <p className="mt-3 text-xs text-[#555555]">
            PayU: <span className="font-mono">{payuStatus}</span>
          </p>
        )}
        {orderId && (
          <p className="mt-2 text-xs text-[#555555]">
            Order: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders">
            <Button className="bg-[#5B8C51] hover:bg-[#4E7A45] w-full">My Orders</Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline" className="w-full">
              Back to cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderPendingPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading…</div>}>
      <PendingContent />
    </Suspense>
  )
}
