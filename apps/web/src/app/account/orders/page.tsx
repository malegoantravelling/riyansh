'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

interface OrderRow {
  id: string
  total_amount: number
  status: string
  payu_txnid?: string
  payu_mihpayid?: string
  payu_status?: string
  paid_at?: string
  created_at: string
  items?: Array<{ product_name: string; quantity: number; price: number }>
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const { user, accessToken, loading } = useAuth()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(true)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000'

  const loadOrders = useCallback(async () => {
    if (!accessToken) return
    const res = await fetch(`${apiBase}/api/orders`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to load orders')
    setOrders(data)
  }, [accessToken, apiBase])

  useEffect(() => {
    if (loading) return
    if (!user || !accessToken) {
      router.replace('/login?next=/account/orders')
      return
    }

    loadOrders()
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false))
  }, [user, accessToken, loading, router, loadOrders])

  const verifyPayment = async (order: OrderRow) => {
    if (!accessToken) return
    setVerifyingId(order.id)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/api/orders/payu/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: order.id, txnid: order.payu_txnid }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')
      if (data.status === 'paid') {
        router.push(
          `/orders/success?order_id=${encodeURIComponent(data.order_id)}&txnid=${encodeURIComponent(data.txnid || '')}`
        )
        return
      }
      await loadOrders()
      if (data.status === 'pending') {
        router.push(
          `/orders/pending?order_id=${encodeURIComponent(order.id)}&txnid=${encodeURIComponent(order.payu_txnid || '')}`
        )
      }
    } catch (err: any) {
      setError(err.message || 'Could not verify payment')
    } finally {
      setVerifyingId(null)
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5B8C51]/20 border-t-[#5B8C51] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#FAF9F5] border-b py-3 text-center text-sm">
        <Link href="/" className="hover:text-[#5B8C51]">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold">My Orders</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF9F5] border border-gray-200">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[#787878] mb-4">You have not placed any orders yet.</p>
            <Link href="/store">
              <Button className="bg-[#5B8C51] hover:bg-[#4E7A45]">Browse store</Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="border border-[#EEEEEE] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-xs text-[#999999] font-mono">{order.id}</p>
                    <p className="text-sm text-[#787878]">
                      {new Date(order.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide px-2 py-1 bg-[#F6F0E2] text-[#3b5d34]">
                    {order.status}
                  </span>
                </div>
                <ul className="text-sm space-y-1 mb-3">
                  {(order.items || []).map((item, idx) => (
                    <li key={idx} className="flex justify-between gap-4">
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm border-t pt-3">
                  <span className="font-bold">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {order.payu_mihpayid || order.payu_txnid ? (
                      <span className="text-xs text-[#787878] font-mono">
                        PayU: {order.payu_mihpayid || order.payu_txnid}
                      </span>
                    ) : null}
                    {order.status === 'pending' && order.payu_txnid ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={verifyingId === order.id}
                        onClick={() => verifyPayment(order)}
                      >
                        {verifyingId === order.id ? 'Checking…' : 'Check payment'}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
