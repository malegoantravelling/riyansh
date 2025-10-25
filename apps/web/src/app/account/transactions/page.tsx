'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, CheckCircle, XCircle, Clock, Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Transaction {
  id: string
  order_id: string
  razorpay_payment_id: string
  amount: number
  currency: string
  status: string
  payment_method: string
  description: string
  created_at: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) return

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
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
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-blue-100 text-blue-800',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[statusLower as keyof typeof colors] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.toUpperCase()}
      </span>
    )
  }

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.razorpay_payment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8BC34A]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">View all your payment transactions</p>
      </div>

      {/* Search Bar */}
      {transactions.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by payment ID, order ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-6 rounded-full">
              <CreditCard className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No transactions found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? 'No transactions match your search criteria.'
              : 'Your payment history will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Left Section */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-[#8BC34A] to-[#7CB342] p-3 rounded-lg">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(transaction.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction.description}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Payment ID:</span>
                          <span className="ml-2 font-mono text-xs">
                            {transaction.razorpay_payment_id}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Order ID:</span>
                          <span className="ml-2 font-mono text-xs">
                            #{transaction.order_id.substring(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Payment Method:</span>
                          <span className="ml-2">{transaction.payment_method}</span>
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>
                          <span className="ml-2">
                            {new Date(transaction.created_at).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end space-y-3 ml-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#8BC34A]">
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500">{transaction.currency}</div>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Download receipt functionality
                      alert('Receipt download feature coming soon!')
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
            <div className="text-3xl font-bold text-gray-900">{transactions.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className="text-3xl font-bold text-[#8BC34A]">
              {formatCurrency(
                transactions
                  .filter((tx) => tx.status === 'success')
                  .reduce((sum, tx) => sum + tx.amount, 0)
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Successful Payments</div>
            <div className="text-3xl font-bold text-green-600">
              {transactions.filter((tx) => tx.status === 'success').length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
