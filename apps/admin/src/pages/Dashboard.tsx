import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

// Indian Rupee Icon Component - Simplified ₹ symbol
const IndianRupee = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className={className}
      viewBox="0 0 16 16"
    >
      <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
    </svg>
  )
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
  user?: {
    full_name: string
    email: string
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 days')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [products, orders, users] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/orders/all'),
        api.get('/api/users'),
      ])

      const revenue = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0)

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: revenue,
      })

      // Get last 5 orders
      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: IndianRupee,
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      change: '+12.5%',
      changeType: 'increase',
      lightBg: 'bg-emerald-50',
      lightColor: 'text-emerald-600',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      change: '+8.2%',
      changeType: 'increase',
      lightBg: 'bg-blue-50',
      lightColor: 'text-blue-600',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      change: '+3.1%',
      changeType: 'increase',
      lightBg: 'bg-purple-50',
      lightColor: 'text-purple-600',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      change: '-2.4%',
      changeType: 'decrease',
      lightBg: 'bg-orange-50',
      lightColor: 'text-orange-600',
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#27AE60] mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setDateFilterOpen(!dateFilterOpen)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700 font-medium">{selectedDateRange}</span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                dateFilterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dateFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              {['Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 6 months', 'This year'].map(
                (range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedDateRange(range)
                      setDateFilterOpen(false)
                      // Trigger data refetch with new date range
                      console.log('Filtering by:', range)
                      fetchData()
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      selectedDateRange === range ? 'text-[#27AE60] font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {range}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const isIncrease = stat.changeType === 'increase'

          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.lightBg} p-3 rounded-xl group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`h-6 w-6 ${stat.lightColor}`} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-semibold ${
                    isIncrease ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isIncrease ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">This Month</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(stats.totalRevenue * 0.6)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Last Month</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(stats.totalRevenue * 0.4)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders?status=completed')}
              className="w-full flex items-center justify-between hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-semibold text-green-600">
                {Math.floor(stats.totalOrders * 0.7)}
              </span>
            </button>
            <button
              onClick={() => navigate('/orders?status=processing')}
              className="w-full flex items-center justify-between hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-600">Processing</span>
              <span className="text-sm font-semibold text-blue-600">
                {Math.floor(stats.totalOrders * 0.2)}
              </span>
            </button>
            <button
              onClick={() => navigate('/orders?status=pending')}
              className="w-full flex items-center justify-between hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-semibold text-yellow-600">
                {Math.floor(stats.totalOrders * 0.1)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500 mt-1">Latest orders from your customers</p>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center space-x-2 px-4 py-2 text-[#27AE60] hover:bg-green-50 rounded-xl transition-colors"
            >
              <span className="font-medium">View All</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.user?.full_name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center space-x-1 text-[#27AE60] hover:text-[#229954] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">
                When customers place orders, they'll appear here.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-2 bg-[#27AE60] text-white rounded-xl hover:bg-[#229954] transition-colors font-medium"
              >
                Add First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
