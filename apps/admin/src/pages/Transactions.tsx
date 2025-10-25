import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { CreditCard, CheckCircle, XCircle, Clock, Search, Filter } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

interface Transaction {
  id: string
  user_id: string
  order_id: string
  razorpay_payment_id: string
  razorpay_order_id: string
  amount: number
  currency: string
  status: string
  payment_method: string
  description: string
  created_at: string
  metadata: any
}

interface User {
  full_name: string
  email: string
}

interface TransactionWithUser extends Transaction {
  user?: User
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const data = await api.get('/api/transactions')
      setTransactions(data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    const colors = {
      success: 'bg-green-100 text-green-700 border-green-300',
      failed: 'bg-red-100 text-red-700 border-red-300',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      refunded: 'bg-blue-100 text-blue-700 border-blue-300',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          colors[statusLower as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-300'
        }`}
      >
        {status.toUpperCase()}
      </span>
    )
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.razorpay_payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.order_id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: transactions.length,
    success: transactions.filter((tx) => tx.status === 'success').length,
    pending: transactions.filter((tx) => tx.status === 'pending').length,
    failed: transactions.filter((tx) => tx.status === 'failed').length,
    totalAmount: transactions
      .filter((tx) => tx.status === 'success')
      .reduce((sum, tx) => sum + tx.amount, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8BC34A]"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Transactions</h1>
        <p className="text-gray-600">Monitor all payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="text-sm text-gray-600 mb-1">Successful</div>
          <div className="text-3xl font-bold text-green-600">{stats.success}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="text-sm text-gray-600 mb-1">Failed</div>
          <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#8BC34A]">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-[#8BC34A]">₹{stats.totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by payment ID, customer, or order..."
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
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-6 rounded-full">
                <CreditCard className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No transactions found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'No transactions match your filters.'
                : 'Transactions will appear here once customers make payments.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-[#8BC34A] to-[#7CB342] p-2 rounded">
                          <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.payment_method}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {transaction.razorpay_payment_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.user?.full_name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono text-gray-900">
                        #{transaction.order_id.substring(0, 8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-[#8BC34A]">
                        ₹{transaction.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">{transaction.currency}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        {getStatusBadge(transaction.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          alert(`Transaction Details:\n\n${JSON.stringify(transaction, null, 2)}`)
                        }}
                      >
                        View Details
                      </Button>
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
