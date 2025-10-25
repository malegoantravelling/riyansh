import { X, CreditCard, User, Package, Calendar, DollarSign, CheckCircle } from 'lucide-react'

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
  user?: {
    full_name: string
    email: string
  }
}

interface TransactionModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
}

export default function TransactionModal({ transaction, isOpen, onClose }: TransactionModalProps) {
  if (!isOpen || !transaction) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                <p className="text-sm text-white/80">Complete payment information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="text-lg font-bold text-green-700 uppercase">{transaction.status}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-[#8BC34A]">
                  ₹{transaction.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Transaction Information */}
            <div className="space-y-4">
              {/* Customer Information */}
              {transaction.user && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-5 w-5 text-[#8BC34A]" />
                    <h3 className="font-semibold text-gray-800">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.user.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">{transaction.user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="h-5 w-5 text-[#8BC34A]" />
                  <h3 className="font-semibold text-gray-800">Payment Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.payment_method}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Currency</p>
                      <p className="text-sm font-medium text-gray-900">{transaction.currency}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                    <p className="text-sm font-mono text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                      {transaction.razorpay_payment_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Razorpay Order ID</p>
                    <p className="text-sm font-mono text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                      {transaction.razorpay_order_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Package className="h-5 w-5 text-[#8BC34A]" />
                  <h3 className="font-semibold text-gray-800">Order Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="text-sm font-mono text-gray-900 bg-white px-3 py-2 rounded border border-gray-200">
                      #{transaction.order_id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction IDs */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <DollarSign className="h-5 w-5 text-[#8BC34A]" />
                  <h3 className="font-semibold text-gray-800">Transaction IDs</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                    <p className="text-xs font-mono text-gray-700 bg-white px-3 py-2 rounded border border-gray-200 break-all">
                      {transaction.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                    <p className="text-xs font-mono text-gray-700 bg-white px-3 py-2 rounded border border-gray-200 break-all">
                      {transaction.user_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Order ID</p>
                    <p className="text-xs font-mono text-gray-700 bg-white px-3 py-2 rounded border border-gray-200 break-all">
                      {transaction.order_id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-5 w-5 text-[#8BC34A]" />
                  <h3 className="font-semibold text-gray-800">Timestamp</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                        dateStyle: 'long',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(transaction.created_at).toLocaleTimeString('en-IN', {
                        timeStyle: 'medium',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">Additional Information</h3>
                  <div className="space-y-2">
                    {Object.entries(transaction.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start">
                        <p className="text-xs text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </p>
                        <p className="text-xs font-medium text-gray-900 text-right max-w-[60%]">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
