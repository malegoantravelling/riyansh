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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Payment status updates automatically from PayU after checkout (UPI, cards, net banking,
            etc.).
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
              placeholder="Search by order ID, customer, PayU txn…"
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
                ? 'No orders match your current filters. Try “Completed payments” or All statuses.'
                : 'No completed PayU payments yet. Paid orders appear here after customers finish checkout on PayU.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PayU txn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PayU status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">
                      {order.id.slice(0, 8)}…
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.user?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 font-mono">
                      <div>{order.payu_txnid || '—'}</div>
                      {order.payu_mihpayid && (
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          mihpayid {order.payu_mihpayid}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {order.payu_status || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                      {order.paid_at && (
                        <div className="text-[10px] text-gray-400 mt-1">
                          Paid {new Date(order.paid_at).toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
