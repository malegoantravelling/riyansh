import { useEffect, useState } from 'react'
import { Search, Filter, ShoppingCart, RefreshCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  // Default: only completed (PayU-paid) orders — status is set by PayU, not admin dropdown.
  const [statusFilter, setStatusFilter] = useState<string>('paid')
  const [dateFilter, setDateFilter] = useState<string>('all')

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
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.payu_txnid || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      String(order.payu_mihpayid || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

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
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg">
            Payment status updates automatically from PayU after checkout (UPI, cards, net banking, etc.).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => void fetchOrders()}
          disabled={loading}
          className="gap-2 min-h-[40px]"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search order ID, customer, txn…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-4 h-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5B8C51] focus:border-transparent"
            >
              <option value="paid">Completed (paid)</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
              <option value="all">All statuses</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 h-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5B8C51] focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last-week">Last 7 Days</option>
              <option value="last-month">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="mt-3 text-xs sm:text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
          {statusFilter === 'paid' ? ` · ${paidCount} paid total` : null}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== 'paid' || dateFilter !== 'all'
                ? 'No orders match your current filters. Try "Completed payments" or All statuses.'
                : 'No completed PayU payments yet. Paid orders appear here after customers finish checkout on PayU.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop / tablet table with horizontal scroll */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">PayU txn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">PayU status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-500">{order.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3.5 text-sm text-gray-900">{order.user?.email || 'N/A'}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{formatCurrency(order.total_amount)}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-600 font-mono">
                        <div>{order.payu_txnid || '—'}</div>
                        {order.payu_mihpayid && (
                          <div className="text-[10px] text-gray-400 mt-0.5">mihpayid {order.payu_mihpayid}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-600">{order.payu_status || '—'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        {order.paid_at && (
                          <div className="text-[10px] text-gray-400 mt-1">
                            Paid {new Date(order.paid_at).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs text-gray-500 font-semibold">{order.id.slice(0, 8)}…</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900 truncate flex-1 mr-2">{order.user?.email || 'N/A'}</p>
                    <p className="text-sm font-bold text-gray-900 shrink-0">{formatCurrency(order.total_amount)}</p>
                  </div>
                  {order.payu_txnid && (
                    <p className="text-[11px] text-gray-500 font-mono">txn: {order.payu_txnid}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-0.5">
                    <span>{order.payu_status || '—'}</span>
                    <span>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
