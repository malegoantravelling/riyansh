import {
  X,
  CreditCard,
  User,
  Package,
  Calendar,
  MapPin,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  FileText,
} from 'lucide-react'

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

interface ShippingAddress {
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  zip_code?: string
  phone?: string
  [key: string]: any
}

const formatShippingAddress = (address: ShippingAddress | string): string => {
  let parsedAddress: ShippingAddress | null = null

  if (typeof address === 'string') {
    try {
      parsedAddress = JSON.parse(address) as ShippingAddress
    } catch {
      return address
    }
  } else {
    parsedAddress = address
  }

  if (!parsedAddress || typeof parsedAddress !== 'object') return 'N/A'

  const parts: string[] = []
  if (parsedAddress.address_line_1) parts.push(parsedAddress.address_line_1)
  if (parsedAddress.address_line_2) parts.push(parsedAddress.address_line_2)
  if (parsedAddress.city) parts.push(parsedAddress.city)
  if (parsedAddress.state) parts.push(parsedAddress.state)
  if (parsedAddress.zip_code) parts.push(parsedAddress.zip_code)

  return parts.length > 0 ? parts.join(', ') : 'N/A'
}

const getStatusConfig = (status: string) => {
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'success':
      return {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconBg: 'bg-green-500',
        textColor: 'text-green-700',
        badgeColor: 'bg-green-100 text-green-800 border-green-300',
      }
    case 'failed':
      return {
        icon: XCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-500',
        textColor: 'text-red-700',
        badgeColor: 'bg-red-100 text-red-800 border-red-300',
      }
    case 'pending':
      return {
        icon: Clock,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconBg: 'bg-yellow-500',
        textColor: 'text-yellow-700',
        badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      }
    default:
      return {
        icon: Clock,
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        iconBg: 'bg-gray-500',
        textColor: 'text-gray-700',
        badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
      }
  }
}

export default function TransactionModal({ transaction, isOpen, onClose }: TransactionModalProps) {
  if (!isOpen || !transaction) return null

  const statusConfig = getStatusConfig(transaction.status)
  const StatusIcon = statusConfig.icon

  // Parse metadata
  const shippingAddressRaw =
    transaction.metadata?.shipping_address || transaction.metadata?.shippingAddress
  const orderItemsCount =
    transaction.metadata?.order_items_count || transaction.metadata?.orderItemsCount || 0

  // Format shipping address
  const formattedAddress = shippingAddressRaw ? formatShippingAddress(shippingAddressRaw) : null

  // Extract phone from shipping address
  let shippingPhone: string | null = null
  if (shippingAddressRaw) {
    if (typeof shippingAddressRaw === 'object') {
      shippingPhone = shippingAddressRaw.phone || null
    } else if (typeof shippingAddressRaw === 'string') {
      try {
        const parsed = JSON.parse(shippingAddressRaw) as ShippingAddress
        shippingPhone = parsed.phone || null
      } catch {
        // If parsing fails, phone is not available
      }
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-scale-in pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#27AE60] via-[#229954] to-[#1E8449] px-8 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Transaction Details
                </h2>
                <p className="text-sm text-white/90 mt-1 font-medium">
                  Complete payment information and order details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:rotate-90"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(95vh-180px)] custom-scrollbar">
            {/* Status & Amount Card */}
            <div
              className={`flex items-center justify-between mb-8 p-6 ${statusConfig.bgColor} border-2 ${statusConfig.borderColor} rounded-2xl shadow-sm`}
            >
              <div className="flex items-center space-x-4">
                <div className={`${statusConfig.iconBg} p-3 rounded-xl shadow-md`}>
                  <StatusIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Payment Status</p>
                  <p
                    className={`text-xl font-bold ${statusConfig.textColor} uppercase tracking-wide`}
                  >
                    {transaction.status}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-2">Total Amount</p>
                <p className="text-3xl font-extrabold text-[#27AE60]">
                  ₹{transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1 uppercase">{transaction.currency}</p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Customer Information */}
                {transaction.user && (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="bg-gradient-to-br from-[#27AE60] to-[#229954] p-2.5 rounded-xl">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Customer Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Full Name
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {transaction.user.full_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Email Address
                        </p>
                        <p className="text-base font-medium text-gray-900 break-all">
                          {transaction.user.email}
                        </p>
                      </div>
                      {shippingPhone && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            Phone Number
                          </p>
                          <p className="text-base font-medium text-gray-900">{shippingPhone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {formattedAddress && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-5">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">Shipping Address</h3>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-blue-100">
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">
                        {formattedAddress}
                      </p>
                    </div>
                    {shippingPhone && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Contact</p>
                        <p className="text-sm font-medium text-gray-900">{shippingPhone}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Information */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 rounded-xl">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Order Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Order ID
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-sm font-mono font-semibold text-gray-900">
                          #{transaction.order_id.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Description
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description || 'N/A'}
                      </p>
                    </div>
                    {orderItemsCount > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Items Count
                        </p>
                        <div className="inline-flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                          <ShoppingBag className="h-4 w-4 text-gray-600" />
                          <p className="text-sm font-semibold text-gray-900">{orderItemsCount}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Payment Details */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Payment Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Payment Method
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {transaction.payment_method}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                          Currency
                        </p>
                        <p className="text-sm font-semibold text-gray-900 uppercase">
                          {transaction.currency}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Payment ID
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-xs font-mono text-gray-900 break-all">
                          {transaction.razorpay_payment_id}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Razorpay Order ID
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-xs font-mono text-gray-900 break-all">
                          {transaction.razorpay_order_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction IDs */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-2.5 rounded-xl">
                      <Hash className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Transaction IDs</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Transaction ID
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {transaction.id}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        User ID
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {transaction.user_id}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Full Order ID
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {transaction.order_id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2.5 rounded-xl">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Transaction Date & Time</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Date
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Time
                      </p>
                      <div className="bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(transaction.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metadata (if any other fields exist) */}
            {transaction.metadata &&
              Object.keys(transaction.metadata).filter(
                (key) =>
                  key !== 'shipping_address' &&
                  key !== 'shippingAddress' &&
                  key !== 'order_items_count' &&
                  key !== 'orderItemsCount'
              ).length > 0 && (
                <div className="mt-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-2.5 rounded-xl">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Additional Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(transaction.metadata)
                      .filter(
                        ([key]) =>
                          key !== 'shipping_address' &&
                          key !== 'shippingAddress' &&
                          key !== 'order_items_count' &&
                          key !== 'orderItemsCount'
                      )
                      .map(([key, value]) => (
                        <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            {key
                              .replace(/_/g, ' ')
                              .replace(/([A-Z])/g, ' $1')
                              .trim()}
                          </p>
                          <p className="text-sm font-medium text-gray-900 break-words">
                            {typeof value === 'object' && value !== null
                              ? JSON.stringify(value, null, 2)
                              : String(value)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-[#27AE60] to-[#229954] text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center space-x-2"
            >
              <span>Close</span>
              <X className="h-4 w-4" />
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
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  )
}
