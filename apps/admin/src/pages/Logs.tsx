import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import {
  Activity,
  ShoppingCart,
  CreditCard,
  Package,
  User,
  LogIn,
  LogOut,
  Search,
  Filter,
  Calendar,
} from 'lucide-react'
import { Input } from '../components/ui/input'

interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  description: string
  metadata: any
  created_at: string
}

interface UserInfo {
  full_name: string
  email: string
}

interface LogWithUser extends ActivityLog {
  user?: UserInfo
}

export default function Logs() {
  const [logs, setLogs] = useState<LogWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const data = await api.get('/api/logs')
      setLogs(data)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    const iconClass = 'h-5 w-5'
    switch (action.toLowerCase()) {
      case 'login':
        return <LogIn className={iconClass} />
      case 'logout':
        return <LogOut className={iconClass} />
      case 'order_placed':
        return <ShoppingCart className={iconClass} />
      case 'payment_success':
        return <CreditCard className={iconClass} />
      case 'product_created':
      case 'product_updated':
      case 'product_deleted':
        return <Package className={iconClass} />
      case 'user_created':
      case 'user_updated':
      case 'user_deleted':
        return <User className={iconClass} />
      default:
        return <Activity className={iconClass} />
    }
  }

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'logout':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'order_placed':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'payment_success':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'product_created':
        return 'bg-teal-100 text-teal-700 border-teal-300'
      case 'product_updated':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'product_deleted':
      case 'user_deleted':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === 'all' || log.action === actionFilter

    return matchesSearch && matchesAction
  })

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))

  const stats = {
    total: logs.length,
    today: logs.filter(
      (log) => new Date(log.created_at).toDateString() === new Date().toDateString()
    ).length,
    payments: logs.filter((log) => log.action === 'payment_success').length,
    orders: logs.filter((log) => log.action === 'order_placed').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5B8C51]"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Activity Logs</h1>
        <p className="text-sm text-gray-600">Monitor all system activities and user actions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Activities</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</div>
            </div>
            <Activity className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 opacity-20 shrink-0" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Today's Activities</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.today}</div>
            </div>
            <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 opacity-20 shrink-0" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Orders Placed</div>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.orders}</div>
            </div>
            <ShoppingCart className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 opacity-20 shrink-0" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-[#5B8C51]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm text-gray-600 mb-1">Payments</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#5B8C51]">{stats.payments}</div>
            </div>
            <CreditCard className="h-8 w-8 sm:h-12 sm:w-12 text-[#5B8C51] opacity-20 shrink-0" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search activities…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full pl-9 pr-4 h-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#5B8C51] focus:border-transparent"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-6 rounded-full">
                <Activity className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No activities found</h3>
            <p className="text-gray-600">
              {searchTerm || actionFilter !== 'all'
                ? 'No activities match your filters.'
                : 'Activity logs will appear here.'}
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {filteredLogs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  {/* Timeline icon */}
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className={`p-1.5 sm:p-2 rounded-full border-2 ${getActionColor(log.action)} bg-white`}>
                      {getActionIcon(log.action)}
                    </div>
                    {index < filteredLogs.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 absolute top-10" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-1.5 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-semibold border ${getActionColor(log.action)}`}>
                            {log.action.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          {log.entity_type && (
                            <span className="text-[10px] sm:text-xs text-gray-500">{log.entity_type.toUpperCase()}</span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base text-gray-900 font-medium mb-1">{log.description}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span>{log.user?.full_name || 'System'}</span>
                          </div>
                          {log.user?.email && (
                            <span className="text-gray-500 hidden sm:inline truncate max-w-[200px]">{log.user.email}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-1">
                        <div className="text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleDateString('en-IN')}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          Additional Details:
                        </div>
                        <div className="text-xs text-gray-700 space-y-1">
                          {Object.entries(log.metadata).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="font-medium mr-2">{key}:</span>
                              <span>{JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
