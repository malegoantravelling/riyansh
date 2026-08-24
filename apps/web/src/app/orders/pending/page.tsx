'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { resolveApiBase } from '@/lib/apiBase'

function PendingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { getAccessToken, loading: authLoading } = useAuth()
  const orderId = params.get('order_id')
  const txnid = params.get('txnid')
  const [message, setMessage] = useState('Checking payment with PayU…')
  const [payuStatus, setPayuStatus] = useState<string | null>(null)
  const [stopped, setStopped] = useState(false)
  const attempts = useRef(0)

  useEffect(() => {
    if (authLoading) return
    if (!orderId && !txnid) {
      setMessage('Missing order details.')
      setStopped(true)
      return
    }

    let cancelled = false
    const apiBase = resolveApiBase()
    const loginNext = `/orders/pending?order_id=${orderId || ''}&txnid=${txnid || ''}`

    const poll = async () => {
      if (cancelled) return
      attempts.current += 1
      try {
        let token = await getAccessToken()
        if (!token) {
          router.replace(`/login?next=${encodeURIComponent(loginNext)}`)
          return
        }

        let res = await fetch(`${apiBase}/api/orders/payu/verify`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId, txnid }),
        })

        if (res.status === 401) {
          token = await getAccessToken({ forceRefresh: true })
          if (!token) {
            router.replace(`/login?next=${encodeURIComponent(loginNext)}`)
            return
          }
          res = await fetch(`${apiBase}/api/orders/payu/verify`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order_id: orderId, txnid }),
          })
        }

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
              : 'Complete payment in your UPI app if it is still open. We are waiting for confirmation…'
          )
        }
      } catch {
        setMessage('Network error while verifying payment. Retrying…')
      }

      if (attempts.current >= 60) {
        setStopped(true)
        setMessage(
          'Still waiting for PayU confirmation. You can tap Check payment later from My Orders.'
        )
        return
      }

      window.setTimeout(poll, 3000)
    }

    setMessage('Waiting for you to finish payment in the UPI app…')
    void poll()
    return () => {
      cancelled = true
    }
  }, [authLoading, getAccessToken, orderId, router, txnid])

  return (
    <div className="page-shell surface-band flex min-h-[60vh] items-center justify-center px-4">
      <div className="surface-glass w-full max-w-md rounded-2xl p-8 text-center">
        {!stopped && <Loader2 className="h-12 w-12 text-[#013220] mx-auto mb-4 animate-spin" />}
        <h1 className="text-2xl font-bold text-[#013220]">Confirming payment</h1>
        <p className="mt-2 text-sm text-[#80866e]">{message}</p>
        {payuStatus && (
          <p className="mt-3 text-xs text-[#80866e]">
            PayU: <span className="font-mono">{payuStatus}</span>
          </p>
        )}
        {orderId && (
          <p className="mt-2 text-xs text-[#80866e]">
            Order: <span className="font-mono">{orderId}</span>
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders">
            <Button className="bg-[#013220] hover:bg-[#012418] w-full">My Orders</Button>
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
    <Suspense
      fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading…</div>}
    >
      <PendingContent />
    </Suspense>
  )
}
