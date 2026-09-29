import { useEffect, useState, Fragment } from 'react'
import {
  Search,
  Filter,
  ShoppingCart,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  CreditCard,
  User,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

function formatAddress(addr: any): string {
  if (!addr || typeof addr !== 'object') return '—'
  const line1 = addr.address1 || addr.address_line_1 || addr.street_address || ''
  const parts = [
    addr.firstname || addr.full_name,
    line1,
    [addr.city, addr.state].filter(Boolean).join(', '),
    addr.pincode || addr.zipcode || addr.zip_code,
    addr.country,
    addr.phone ? `Phone: ${addr.phone}` : null,
  ].filter(Boolean)
  return parts.length ? parts.join('\n') : '—'
}

function paymentLabel(order: any): string {
  const raw =
    order.payment_method ||
    order.shipping_address?._payment_method ||
    order.payment_mode ||
    ''
  if (!raw) return '—'
  if (raw === 'hosted') return 'PayU hosted (card / NB / wallet)'
  if (String(raw).startsWith('upi_intent:')) {
    return `UPI (${String(raw).replace('upi_intent:', '')})`
  }
  return String(raw)
}

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('paid')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    void fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await api.get('/api/orders/all')
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-emerald-100 text-emerald-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredOrders = orders.filter((order) => {
    const hay = [
      order.id,
      order.user?.email,
      order.user?.full_name,
      order.user?.phone,
      order.payu_txnid,
      order.payu_mihpayid,
      order.shipping_address?.phone,
      order.shipping_address?.firstname,
      ...(order.items || []).map((i: any) => i.product_name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch = !searchTerm || hay.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    const matchesDate = (() => {
      const orderDate = new Date(order.created_at)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case 'today':
          return orderDate >= today
        case 'yesterday':
          return orderDate >= yesterday && orderDate < today
        case 'last-week':
          return orderDate >= lastWeek
        case 'last-month':
          return orderDate >= lastMonth
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  const paidCount = orders.filter((o) => o.status === 'paid').length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Click an order to see customer, products, shipping address, and payment details.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void fetchOrders()}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search customer, product, phone, PayU…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            >
              <option value="paid">Completed payments (paid)</option>
              <option value="pending">Pending (awaiting PayU)</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All statuses</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last-week">Last 7 Days</option>
              <option value="last-month">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
          {statusFilter === 'paid' ? ` · ${paidCount} paid total` : null}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'paid' || dateFilter !== 'all'
                ? 'No orders match your current filters.'
                : 'No completed PayU payments yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-8" />
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Products
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const open = expandedId === order.id
                  const itemSummary = (order.items || [])
                    .map((i: any) => `${i.product_name} ×${i.quantity}`)
                    .join(', ')
                  return (
                    <Fragment key={order.id}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setExpandedId(open ? null : order.id)}
                      >
                        <td className="px-4 py-4 text-gray-400">
                          {open ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm font-mono text-gray-600">
                          {order.id.slice(0, 8)}…
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div className="font-medium">
                            {order.user?.full_name ||
                              order.shipping_address?.firstname ||
                              '—'}
                          </div>
                          <div className="text-xs text-gray-500">{order.user?.email || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700 max-w-[220px] truncate">
                          {itemSummary || '—'}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString('en-IN')}
                        </td>
                      </tr>
                      {open ? (
                        <tr className="bg-[#FAFBF8]">
                          <td colSpan={7} className="px-6 py-5">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <User className="h-4 w-4 text-[#5B8C51]" /> Customer
                                </h4>
                                <dl className="space-y-1 text-gray-600">
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">Name</dt>
                                    <dd>
                                      {order.user?.full_name ||
                                        order.shipping_address?.firstname ||
                                        '—'}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">Email</dt>
                                    <dd>{order.user?.email || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">Phone</dt>
                                    <dd>
                                      {order.shipping_address?.phone || order.user?.phone || '—'}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">User ID</dt>
                                    <dd className="font-mono text-xs break-all">
                                      {order.user_id || '—'}
                                    </dd>
                                  </div>
                                </dl>
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-[#5B8C51]" /> Shipping
                                </h4>
                                <pre className="whitespace-pre-wrap font-sans text-gray-600 bg-white border border-gray-100 rounded-lg p-3">
                                  {formatAddress(order.shipping_address)}
                                </pre>
                                {order.notes ? (
                                  <p className="text-xs text-gray-500">
                                    <span className="font-semibold">Notes:</span> {order.notes}
                                  </p>
                                ) : null}
                              </div>

                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-[#5B8C51]" /> Payment
                                </h4>
                                <dl className="space-y-1 text-gray-600">
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">Method</dt>
                                    <dd>{paymentLabel(order)}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">PayU mode</dt>
                                    <dd>{order.payment_mode || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">Txn ID</dt>
                                    <dd className="font-mono text-xs break-all">
                                      {order.payu_txnid || '—'}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">Mihpay ID</dt>
                                    <dd className="font-mono text-xs break-all">
                                      {order.payu_mihpayid || '—'}
                                    </dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">PayU status</dt>
                                    <dd>{order.payu_status || '—'}</dd>
                                  </div>
                                  <div>
                                    <dt className="text-xs uppercase text-gray-400">Paid at</dt>
                                    <dd>
                                      {order.paid_at
                                        ? new Date(order.paid_at).toLocaleString('en-IN')
                                        : '—'}
                                    </dd>
                                  </div>
                                </dl>
                              </div>
                            </div>

                            <div className="mt-6">
                              <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                                <Package className="h-4 w-4 text-[#5B8C51]" /> Products
                              </h4>
                              <div className="overflow-x-auto border border-gray-100 rounded-lg bg-white">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                    <tr>
                                      <th className="px-3 py-2 text-left">Item</th>
                                      <th className="px-3 py-2 text-right">Qty</th>
                                      <th className="px-3 py-2 text-right">Price</th>
                                      <th className="px-3 py-2 text-right">Line total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    {(order.items || []).map((item: any) => (
                                      <tr key={item.id || `${item.product_id}-${item.product_name}`}>
                                        <td className="px-3 py-2">
                                          <div className="flex items-center gap-3">
                                            {item.product_image || item.product?.image_url ? (
                                              <img
                                                src={item.product_image || item.product?.image_url}
                                                alt=""
                                                className="w-10 h-10 object-contain rounded border bg-[#FAF9F5]"
                                              />
                                            ) : (
                                              <div className="w-10 h-10 rounded bg-gray-100" />
                                            )}
                                            <span className="font-medium text-gray-800">
                                              {item.product_name}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                                        <td className="px-3 py-2 text-right">
                                          {formatCurrency(item.price)}
                                        </td>
                                        <td className="px-3 py-2 text-right font-semibold">
                                          {formatCurrency(Number(item.price) * Number(item.quantity))}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr className="border-t">
                                      <td colSpan={3} className="px-3 py-2 text-right font-semibold">
                                        Order total
                                      </td>
                                      <td className="px-3 py-2 text-right font-bold text-[#5B8C51]">
                                        {formatCurrency(order.total_amount)}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
