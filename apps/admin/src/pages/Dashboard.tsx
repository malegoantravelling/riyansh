import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  Loader2,
  ChevronDown,
  IndianRupee,
} from 'lucide-react'
import { api } from '@/lib/api'
import { cn, formatCurrency } from '@/lib/utils'

type DateRangeKey = '7d' | '30d' | '90d' | '180d' | 'year'

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: string
  created_at: string
  paid_at?: string | null
  user?: {
    full_name?: string
    email?: string
  }
}

const RANGE_OPTIONS: { key: DateRangeKey; label: string }[] = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 3 months' },
  { key: '180d', label: 'Last 6 months' },
  { key: 'year', label: 'This year' },
]

/** Payment collected — counts toward revenue. */
const REVENUE_STATUSES = new Set(['paid', 'completed', 'processing', 'shipped', 'delivered'])

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function rangeStart(key: DateRangeKey, now = new Date()): Date {
  const today = startOfDay(now)
  switch (key) {
    case '7d': {
      const d = new Date(today)
      d.setDate(d.getDate() - 6)
      return d
    }
    case '30d': {
      const d = new Date(today)
      d.setDate(d.getDate() - 29)
      return d
    }
    case '90d': {
      const d = new Date(today)
      d.setDate(d.getDate() - 89)
      return d
    }
    case '180d': {
      const d = new Date(today)
      d.setDate(d.getDate() - 179)
      return d
    }
    case 'year':
      return new Date(today.getFullYear(), 0, 1)
    default: {
      const _exhaustive: never = key
      return _exhaustive
    }
  }
}

function previousPeriodBounds(key: DateRangeKey, now = new Date()): { start: Date; end: Date } {
  const currentStart = rangeStart(key, now)
  const end = new Date(currentStart.getTime() - 1)
  const ms = now.getTime() - currentStart.getTime()
  const start = new Date(end.getTime() - ms)
  return { start, end }
}

function inRange(dateIso: string, start: Date, end: Date) {
  const t = new Date(dateIso).getTime()
  return t >= start.getTime() && t <= end.getTime()
}

function isRevenueOrder(order: Order) {
  return REVENUE_STATUSES.has(String(order.status || '').toLowerCase())
}

function orderAmount(order: Order) {
  return Number(order.total_amount) || 0
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / previous) * 100
}

function formatTrend(change: number | null): { label: string; up: boolean } {
  if (change === null) return { label: 'New', up: true }
  const up = change >= 0
  const abs = Math.abs(change)
  return {
    label: `${up ? '+' : '−'}${abs.toFixed(1)}%`,
    up,
  }
}

function statusTone(status: string) {
  const key = status.toLowerCase()
  switch (key) {
    case 'paid':
    case 'completed':
    case 'delivered':
      return 'bg-emerald-50 text-emerald-800 border-emerald-100'
    case 'processing':
    case 'shipped':
      return 'bg-sky-50 text-sky-800 border-sky-100'
    case 'pending':
      return 'bg-amber-50 text-amber-900 border-amber-100'
    case 'failed':
    case 'cancelled':
      return 'bg-red-50 text-red-800 border-red-100'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100'
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [productCount, setProductCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [rangeKey, setRangeKey] = useState<DateRangeKey>('30d')

  useEffect(() => {
    void fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setLoadError(null)
      const [productsResult, ordersResult, usersResult] = await Promise.allSettled([
        api.get('/api/products?include_inactive=true'),
        api.get('/api/orders/all'),
        api.get('/api/users'),
      ])

      const products =
        productsResult.status === 'fulfilled' && Array.isArray(productsResult.value)
          ? productsResult.value
          : []
      const nextOrders =
        ordersResult.status === 'fulfilled' && Array.isArray(ordersResult.value)
          ? (ordersResult.value as Order[])
          : []
      const users =
        usersResult.status === 'fulfilled' && Array.isArray(usersResult.value)
          ? usersResult.value
          : []

      const failures: string[] = []
      if (productsResult.status === 'rejected') {
        failures.push(`Products: ${productsResult.reason?.message || productsResult.reason}`)
      }
      if (ordersResult.status === 'rejected') {
        failures.push(`Orders: ${ordersResult.reason?.message || ordersResult.reason}`)
      }
      if (usersResult.status === 'rejected') {
        failures.push(`Users: ${usersResult.reason?.message || usersResult.reason}`)
      }

      if (failures.length === 3) {
        setLoadError(
          'Cannot reach the API or admin auth failed. Log out and sign in again (admin / admin123).'
        )
      } else if (failures.length) {
        setLoadError(failures.join(' · '))
      }

      setOrders(nextOrders)
      setProductCount(products.length)
      setUserCount(users.length)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const metrics = useMemo(() => {
    const now = new Date()
    const currentStart = rangeStart(rangeKey, now)
    const prev = previousPeriodBounds(rangeKey, now)
    const thisMonthStart = startOfMonth(now)
    const lastMonthStart = addMonths(thisMonthStart, -1)
    const lastMonthEnd = new Date(thisMonthStart.getTime() - 1)

    const inCurrent = orders.filter((o) => inRange(o.created_at, currentStart, now))
    const inPrevious = orders.filter((o) => inRange(o.created_at, prev.start, prev.end))

    const revenueOrdersCurrent = inCurrent.filter(isRevenueOrder)
    const revenueOrdersPrevious = inPrevious.filter(isRevenueOrder)

    const revenue = revenueOrdersCurrent.reduce((s, o) => s + orderAmount(o), 0)
    const revenuePrev = revenueOrdersPrevious.reduce((s, o) => s + orderAmount(o), 0)

    const orderCount = inCurrent.length
    const orderCountPrev = inPrevious.length

    const thisMonthRevenue = orders
      .filter((o) => isRevenueOrder(o) && inRange(o.created_at, thisMonthStart, now))
      .reduce((s, o) => s + orderAmount(o), 0)

    const lastMonthRevenue = orders
      .filter((o) => isRevenueOrder(o) && inRange(o.created_at, lastMonthStart, lastMonthEnd))
      .reduce((s, o) => s + orderAmount(o), 0)

    const statusCounts: Record<string, number> = {}
    for (const o of inCurrent) {
      const key = String(o.status || 'unknown').toLowerCase()
      statusCounts[key] = (statusCounts[key] || 0) + 1
    }

    const paidCount = (statusCounts.paid || 0) + (statusCounts.completed || 0) + (statusCounts.delivered || 0)
    const processingCount = (statusCounts.processing || 0) + (statusCounts.shipped || 0)
    const pendingCount = statusCounts.pending || 0
    const failedCount = (statusCounts.failed || 0) + (statusCounts.cancelled || 0)

    const maxMonth = Math.max(thisMonthRevenue, lastMonthRevenue, 1)

    const recent = [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)

    return {
      revenue,
      revenueTrend: formatTrend(percentChange(revenue, revenuePrev)),
      orderCount,
      orderTrend: formatTrend(percentChange(orderCount, orderCountPrev)),
      thisMonthRevenue,
      lastMonthRevenue,
      thisMonthPct: Math.round((thisMonthRevenue / maxMonth) * 100),
      lastMonthPct: Math.round((lastMonthRevenue / maxMonth) * 100),
      paidCount,
      processingCount,
      pendingCount,
      failedCount,
      recent,
      rangeLabel: RANGE_OPTIONS.find((r) => r.key === rangeKey)?.label || 'Last 30 days',
    }
  }, [orders, rangeKey])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#013220]" />
          <p className="text-sm text-[#80866e]">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  const cards = [
    {
      label: 'Paid revenue',
      hint: 'Sum of paid / completed orders in range',
      value: formatCurrency(metrics.revenue),
      trend: metrics.revenueTrend,
      icon: IndianRupee,
      tone: 'bg-[#013220]/8 text-[#013220]',
    },
    {
      label: 'Orders',
      hint: 'All orders created in range',
      value: String(metrics.orderCount),
      trend: metrics.orderTrend,
      icon: ShoppingCart,
      tone: 'bg-[#c1c3ac]/50 text-[#013220]',
    },
    {
      label: 'Products',
      hint: 'Catalog size (not date-filtered)',
      value: String(productCount),
      trend: null,
      icon: Package,
      tone: 'bg-[#f6f0e2] text-[#3d5d36]',
    },
    {
      label: 'Customers',
      hint: 'Registered users (not date-filtered)',
      value: String(userCount),
      trend: null,
      icon: Users,
      tone: 'bg-[#7ba672]/20 text-[#013220]',
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-semibold">Dashboard data could not load</p>
          <p className="mt-1">{loadError}</p>
          <button type="button" onClick={() => void fetchData()} className="mt-2 text-xs font-semibold underline">
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#80866e]">Overview</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#013220]">Dashboard</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#80866e]">
            Revenue counts only paid orders — pending and failed are excluded.
          </p>
        </div>

        <div className="relative self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDateFilterOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#013220]/12 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-[#013220] shadow-sm transition hover:bg-[#f7f8f5] min-h-[40px]"
          >
            <Calendar className="h-4 w-4 text-[#80866e] shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">{metrics.rangeLabel}</span>
            <ChevronDown className={cn('h-4 w-4 text-[#80866e] transition shrink-0', dateFilterOpen && 'rotate-180')} />
          </button>
          {dateFilterOpen && (
            <div className="absolute left-0 sm:left-auto sm:right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-[#013220]/10 bg-white py-1 shadow-lg">
              {RANGE_OPTIONS.map((range) => (
                <button
                  key={range.key}
                  type="button"
                  onClick={() => {
                    setRangeKey(range.key)
                    setDateFilterOpen(false)
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#f7f8f5]',
                    rangeKey === range.key ? 'font-semibold text-[#013220]' : 'text-[#3d5d36]'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[#013220]/8 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className={cn('rounded-xl p-2.5', card.tone)}>
                  <Icon className="h-5 w-5" />
                </div>
                {card.trend && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-semibold',
                      card.trend.up ? 'text-emerald-700' : 'text-red-600'
                    )}
                  >
                    {card.trend.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {card.trend.label}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#80866e]">{card.label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#013220]">{card.value}</p>
              <p className="mt-2 text-[11px] leading-snug text-[#80866e]">{card.hint}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#013220]/8 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#013220]">Sales overview</h3>
              <p className="mt-0.5 text-xs text-[#80866e]">Paid revenue by calendar month</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#80866e]">This month</span>
                <span className="font-semibold tabular-nums text-[#013220]">
                  {formatCurrency(metrics.thisMonthRevenue)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#f0f1ec]">
                <div
                  className="h-full rounded-full bg-[#013220] transition-all"
                  style={{ width: `${metrics.thisMonthPct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#80866e]">Last month</span>
                <span className="font-semibold tabular-nums text-[#013220]">
                  {formatCurrency(metrics.lastMonthRevenue)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#f0f1ec]">
                <div
                  className="h-full rounded-full bg-[#7ba672] transition-all"
                  style={{ width: `${metrics.lastMonthPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#013220]/8 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-[#013220]">Order status</h3>
            <p className="mt-0.5 text-xs text-[#80866e]">Counts inside the selected date range</p>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Paid / completed', count: metrics.paidCount, path: '/orders?status=paid' },
              { label: 'Processing', count: metrics.processingCount, path: '/orders?status=processing' },
              { label: 'Pending payment', count: metrics.pendingCount, path: '/orders?status=pending' },
              { label: 'Failed / cancelled', count: metrics.failedCount, path: '/orders?status=failed' },
            ].map((row) => (
              <button
                key={row.label}
                type="button"
                onClick={() => navigate(row.path)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-[#f7f8f5]"
              >
                <span className="text-sm text-[#3d5d36]">{row.label}</span>
                <span className="text-sm font-semibold tabular-nums text-[#013220]">{row.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#013220]/8 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#013220]/8 px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#013220]">Recent orders</h2>
            <p className="mt-0.5 text-xs text-[#80866e]">Latest across all statuses</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[#013220] transition hover:bg-[#f7f8f5] min-h-[36px]"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {metrics.recent.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-[#f7f8f5] text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#80866e]">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Order</th>
                    <th className="px-4 sm:px-6 py-3">Customer</th>
                    <th className="px-4 sm:px-6 py-3">Amount</th>
                    <th className="px-4 sm:px-6 py-3">Status</th>
                    <th className="px-4 sm:px-6 py-3">Date</th>
                    <th className="px-4 sm:px-6 py-3"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#013220]/6">
                  {metrics.recent.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#fafaf8]">
                      <td className="px-4 sm:px-6 py-4 font-mono text-sm text-[#013220]">#{order.id.slice(0, 8)}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="text-sm font-medium text-[#013220]">
                          {order.user?.full_name || 'Guest / unknown'}
                        </p>
                        <p className="text-xs text-[#80866e]">{order.user?.email || '—'}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm font-semibold tabular-nums text-[#013220]">
                        {formatCurrency(orderAmount(order))}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide', statusTone(order.status))}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-[#80866e]">
                        {new Date(order.created_at).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <button
                          type="button"
                          onClick={() => navigate('/orders')}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#013220] hover:underline min-h-[36px]"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-[#013220]/6">
              {metrics.recent.map((order) => (
                <div key={order.id} className="px-4 py-3.5 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-[#013220] font-semibold">#{order.id.slice(0, 8)}</span>
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', statusTone(order.status))}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-[#013220] truncate">
                      {order.user?.full_name || 'Guest'}
                    </p>
                    <p className="text-xs text-[#80866e] truncate">{order.user?.email || '—'}</p>
                    <p className="mt-1 text-[11px] text-[#80866e]">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums text-[#013220]">{formatCurrency(orderAmount(order))}</p>
                    <button
                      type="button"
                      onClick={() => navigate('/orders')}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#013220] hover:underline min-h-[32px]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="px-6 py-12 sm:py-14 text-center">
            <ShoppingCart className="mx-auto mb-3 h-8 w-8 text-[#c1c3ac]" />
            <p className="font-medium text-[#013220]">No orders yet</p>
            <p className="mt-1 text-sm text-[#80866e]">Paid and pending checkouts will show up here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
