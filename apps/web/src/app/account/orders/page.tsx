'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Package, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { Reveal } from '@/components/motion/Reveal'
import { resolveApiBase } from '@/lib/apiBase'
import { cn } from '@/lib/utils'

interface OrderItem {
  product_id?: string | null
  product_name: string
  product_image?: string | null
  product_slug?: string | null
  quantity: number
  price: number
}

interface OrderRow {
  id: string
  total_amount: number
  status: string
  payu_txnid?: string
  payu_mihpayid?: string
  payu_status?: string
  paid_at?: string
  created_at: string
  items?: OrderItem[]
}

function formatInr(amount: number) {
  return `₹ ${Number(amount).toLocaleString('en-IN')}`
}

function shortOrderId(id: string) {
  if (id.length <= 12) return id
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

function statusStyles(status: string) {
  const key = status.toLowerCase()
  switch (key) {
    case 'paid':
    case 'completed':
    case 'delivered':
      return 'bg-jade/50 text-evergreen border-evergreen/15'
    case 'pending':
    case 'processing':
      return 'bg-amber-50 text-amber-900 border-amber-200/80'
    case 'failed':
    case 'cancelled':
      return 'bg-red-50 text-red-800 border-red-100'
    case 'shipped':
      return 'bg-sky-50 text-sky-900 border-sky-100'
    default:
      return 'bg-white text-dusty-olive border-evergreen/10'
  }
}

export default function AccountOrdersPage() {
  const router = useRouter()
  const { user, accessToken, loading } = useAuth()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(true)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)

  const loadOrders = useCallback(async () => {
    if (!accessToken) return
    const res = await fetch(`${resolveApiBase()}/api/orders`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to load orders')
    setOrders(data)
  }, [accessToken])

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
      const res = await fetch(`${resolveApiBase()}/api/orders/payu/verify`, {
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
      <div className="page-shell flex min-h-[50vh] items-center justify-center text-evergreen">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-evergreen/20 border-t-evergreen" />
      </div>
    )
  }

  return (
    <div className="page-shell text-evergreen">
      <div className="container-editorial py-10 sm:py-14">
        <BlurFade>
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-dusty-olive" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-evergreen">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="font-medium text-evergreen">My Orders</span>
          </nav>

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">Account</p>
              <h1 className="font-display text-3xl font-medium tracking-tight text-evergreen sm:text-4xl lg:text-5xl">
                My orders
              </h1>
              <p className="mt-3 text-sm text-dusty-olive sm:text-base">
                {orders.length === 0
                  ? 'No orders yet — your purchase history will appear here.'
                  : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} in your account.`}
              </p>
            </div>
            <Link href="/store" className="shrink-0">
              <Button className="rounded-full bg-evergreen px-6 text-white hover:bg-evergreen-deep hover:text-white">
                Continue shopping
              </Button>
            </Link>
          </div>
        </BlurFade>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <BlurFade delay={0.08}>
            <div className="surface-glass mx-auto max-w-md rounded-3xl px-8 py-14 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-jade/40">
                <Package className="h-7 w-7 text-evergreen/50" />
              </div>
              <h2 className="font-display text-2xl font-medium text-evergreen">No orders yet</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-dusty-olive">
                When you place an order, it will show up here with payment and delivery details.
              </p>
              <Link href="/store" className="mt-8 inline-block">
                <Button size="lg" className="rounded-full px-8">
                  Browse store
                </Button>
              </Link>
            </div>
          </BlurFade>
        ) : (
          <ul className="mx-auto max-w-3xl space-y-4">
            {orders.map((order, index) => {
              const itemCount = (order.items || []).reduce((sum, item) => sum + item.quantity, 0)
              const payuRef = order.payu_mihpayid || order.payu_txnid

              return (
                <Reveal key={order.id} delay={index * 0.05}>
                  <li className="surface-glass overflow-hidden rounded-2xl transition-shadow duration-300 hover:shadow-lift">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-evergreen/8 px-5 py-4 sm:px-6">
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-dusty-olive">Order</p>
                        <p className="mt-1 font-mono text-sm font-medium text-evergreen" title={order.id}>
                          {shortOrderId(order.id)}
                        </p>
                        <p className="mt-1 text-xs text-dusty-olive">
                          {new Date(order.created_at).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {itemCount > 0
                            ? ` · ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
                            : ''}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]',
                          statusStyles(order.status)
                        )}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="px-5 py-4 sm:px-6">
                      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-dusty-olive">
                        Products purchased
                      </p>
                      <ul className="space-y-3">
                        {(order.items || []).map((item, idx) => {
                          const href =
                            item.product_slug || item.product_id
                              ? `/products/${item.product_slug || item.product_id}`
                              : null
                          const displayName = item.product_name?.trim() || 'Product'
                          const thumb = (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-evergreen/10 bg-[#f7f8f5] sm:h-[4.5rem] sm:w-[4.5rem]">
                              {item.product_image ? (
                                <Image
                                  src={item.product_image}
                                  alt={displayName}
                                  fill
                                  sizes="72px"
                                  className="object-contain p-1.5"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package className="h-6 w-6 text-dusty-olive/40" />
                                </div>
                              )}
                            </div>
                          )

                          return (
                            <li
                              key={idx}
                              className="flex items-center gap-3 rounded-xl border border-evergreen/8 bg-white/70 p-3 sm:gap-4 sm:p-3.5"
                            >
                              {href ? (
                                <Link href={href} className="shrink-0 transition-opacity hover:opacity-90">
                                  {thumb}
                                </Link>
                              ) : (
                                thumb
                              )}

                              <div className="min-w-0 flex-1">
                                {href ? (
                                  <Link
                                    href={href}
                                    className="font-display text-base font-medium leading-snug text-evergreen transition-colors hover:text-evergreen-mid"
                                  >
                                    {displayName}
                                  </Link>
                                ) : (
                                  <p className="font-display text-base font-medium leading-snug text-evergreen">
                                    {displayName}
                                  </p>
                                )}
                                <p className="mt-1 text-xs text-dusty-olive">
                                  Qty {item.quantity}
                                  <span className="mx-1.5 text-evergreen/20">·</span>
                                  {formatInr(item.price)} each
                                </p>
                              </div>

                              <p className="shrink-0 font-semibold tabular-nums text-evergreen">
                                {formatInr(item.price * item.quantity)}
                              </p>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-evergreen/8 bg-white/50 px-5 py-4 sm:px-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-dusty-olive">Total</p>
                        <p className="font-display text-xl font-medium text-evergreen">
                          {formatInr(order.total_amount)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {payuRef ? (
                          <span className="rounded-full border border-evergreen/10 bg-white/80 px-3 py-1.5 font-mono text-[11px] text-dusty-olive">
                            PayU · {payuRef}
                          </span>
                        ) : null}
                        {order.status === 'pending' && order.payu_txnid ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            disabled={verifyingId === order.id}
                            onClick={() => verifyPayment(order)}
                          >
                            <RefreshCw
                              className={cn('h-3.5 w-3.5', verifyingId === order.id && 'animate-spin')}
                            />
                            {verifyingId === order.id ? 'Checking…' : 'Check payment'}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </li>
                </Reveal>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
