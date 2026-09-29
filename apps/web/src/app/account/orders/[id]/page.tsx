'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Package, RefreshCw, RotateCcw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { resolveApiBase } from '@/lib/apiBase'
import { shippingFromOrderAddress, writeCheckoutShipping } from '@/lib/checkout'

type OrderItem = {
  id?: string
  product_id?: string
  product_name: string
  product_image?: string
  quantity: number
  price: number
  product?: { id?: string; slug?: string; name?: string; image_url?: string; price?: number }
}

type OrderDetail = {
  id: string
  total_amount: number
  status: string
  notes?: string
  shipping_address?: any
  billing_address?: any
  payu_txnid?: string
  payu_mihpayid?: string
  payu_status?: string
  payment_method?: string
  payment_mode?: string
  paid_at?: string
  created_at: string
  items?: OrderItem[]
  transaction?: any
}

function paymentLabel(order: OrderDetail): string {
  const raw = order.payment_method || order.shipping_address?._payment_method || ''
  if (!raw) return order.payment_mode || 'PayU'
  if (raw === 'hosted') return 'Card / Net banking / Wallet (PayU)'
  if (String(raw).startsWith('upi_intent:')) {
    return `UPI · ${String(raw).replace('upi_intent:', '')}`
  }
  return String(raw)
}

export default function AccountOrderDetailPage() {
  const params = useParams()
  const orderId = String(params.id || '')
  const router = useRouter()
  const toast = useToast()
  const { user, accessToken, loading } = useAuth()
  const { addItem, clearCart } = useCart()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(true)
  const [reordering, setReordering] = useState(false)

  const loadOrder = useCallback(async () => {
    if (!accessToken || !orderId) return
    const res = await fetch(`${resolveApiBase()}/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to load order')
    setOrder(data)
  }, [accessToken, orderId])

  useEffect(() => {
    if (loading) return
    if (!user || !accessToken) {
      router.replace(`/login?next=/account/orders/${orderId}`)
      return
    }
    loadOrder()
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false))
  }, [user, accessToken, loading, router, orderId, loadOrder])

  const handleReorder = async () => {
    if (!order?.items?.length) return
    setReordering(true)
    try {
      clearCart()
      for (const item of order.items) {
        const slug = item.product?.slug || ''
        addItem(
          {
            id: item.product_id || item.product?.id || item.id || item.product_name,
            name: item.product_name,
            slug: slug || item.product_name.toLowerCase().replace(/\s+/g, '-'),
            price: Number(item.price),
            image_url: item.product_image || item.product?.image_url,
          },
          Number(item.quantity) || 1
        )
      }

      const draft = shippingFromOrderAddress(order.shipping_address, order.notes || '')
      if (draft) {
        writeCheckoutShipping(draft)
      }

      toast.success('Ready to reorder', 'Address filled from your last order. Confirm and pay.')
      router.push('/checkout')
    } catch (err: any) {
      toast.error('Reorder failed', err?.message || 'Please try again')
    } finally {
      setReordering(false)
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5B8C51]/20 border-t-[#5B8C51] rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-[#787878] mb-4">{error || 'Order not found'}</p>
        <Link href="/account/orders">
          <Button className="bg-[#5B8C51] hover:bg-[#4E7A45]">Back to orders</Button>
        </Link>
      </div>
    )
  }

  const items = order.items || []
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  const delivery = 0
  const discount = Math.max(0, subtotal + delivery - Number(order.total_amount))
  const addr = order.shipping_address || {}

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#FAF9F5] border-b py-3 text-center text-sm">
        <Link href="/" className="hover:text-[#5B8C51]">
          Home
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/account/orders" className="hover:text-[#5B8C51]">
          My Orders
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold">Order details</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Order details</h1>
            <p className="text-xs font-mono text-[#999999] mt-1 break-all">{order.id}</p>
            <p className="text-sm text-[#787878]">
              {new Date(order.created_at).toLocaleString('en-IN')}
            </p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 bg-[#F6F0E2] text-[#3b5d34]">
            {order.status}
          </span>
        </div>

        <section className="border border-[#EEEEEE] divide-y">
          {items.map((item, idx) => {
            const slug = item.product?.slug
            const image = item.product_image || item.product?.image_url
            const line = Number(item.price) * Number(item.quantity)
            const body = (
              <div className="flex gap-4 p-4 items-center">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A1A]">{item.product_name}</p>
                  <p className="text-sm text-[#787878] mt-0.5">
                    Qty {item.quantity} · ₹{Number(item.price).toLocaleString('en-IN')} each
                  </p>
                  <p className="text-sm font-semibold mt-1">₹{line.toLocaleString('en-IN')}</p>
                </div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-[#FAF9F5] border border-[#EEEEEE] overflow-hidden">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.product_name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-300 m-auto mt-4" />
                  )}
                </div>
              </div>
            )
            return slug ? (
              <Link
                key={item.id || `${item.product_id}-${idx}`}
                href={`/products/${slug}`}
                className="block hover:bg-[#FAFBF8] transition-colors"
              >
                {body}
              </Link>
            ) : (
              <div key={item.id || `${item.product_name}-${idx}`}>{body}</div>
            )
          })}
        </section>

        <section className="border border-[#EEEEEE] p-4 sm:p-5 space-y-2 text-sm">
          <h2 className="font-bold text-[#1A1A1A] mb-3">Payment summary</h2>
          <div className="flex justify-between text-[#555555]">
            <span>Product price</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-[#555555]">
            <span>Discount</span>
            <span>{discount > 0 ? `−₹${discount.toLocaleString('en-IN')}` : '₹0'}</span>
          </div>
          <div className="flex justify-between text-[#555555]">
            <span>Delivery charges</span>
            <span>{delivery > 0 ? `₹${delivery.toLocaleString('en-IN')}` : 'Free'}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-3 mt-2">
            <span>Total</span>
            <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
          </div>
          <div className="pt-3 border-t space-y-1 text-[#666666]">
            <p>
              <span className="font-medium text-[#333]">Payment:</span> {paymentLabel(order)}
            </p>
            {order.payment_mode ? (
              <p>
                <span className="font-medium text-[#333]">Mode:</span> {order.payment_mode}
              </p>
            ) : null}
            {(order.payu_mihpayid || order.payu_txnid) && (
              <p className="font-mono text-xs break-all">
                Txn: {order.payu_mihpayid || order.payu_txnid}
              </p>
            )}
            {order.paid_at ? (
              <p>Paid {new Date(order.paid_at).toLocaleString('en-IN')}</p>
            ) : null}
          </div>
        </section>

        <section className="border border-[#EEEEEE] p-4 sm:p-5 text-sm">
          <h2 className="font-bold text-[#1A1A1A] mb-2">Shipping address</h2>
          <p className="text-[#555555] leading-relaxed whitespace-pre-line">
            {[
              addr.firstname,
              addr.address1,
              [addr.city, addr.state].filter(Boolean).join(', '),
              addr.pincode || addr.zipcode,
              addr.country,
              addr.phone ? `Phone: ${addr.phone}` : null,
            ]
              .filter(Boolean)
              .join('\n') || '—'}
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => void handleReorder()}
            disabled={reordering || order.status !== 'paid'}
            className="bg-[#5B8C51] hover:bg-[#4E7A45] gap-2"
          >
            {reordering ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Reorder
          </Button>
          <Link href="/account/orders">
            <Button variant="outline">Back to orders</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
