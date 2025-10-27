'use client'

import React, { useState, useEffect } from 'react'
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  ShoppingBag,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  items: OrderItem[]
  shipping_address: any
}

interface OrderItem {
  id: string
  product_name: string
  product_image?: string
  quantity: number
  price: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const { data, error } = await supabase
          .from('orders')
          .select(
            `
            *,
            items:order_items(*)
          `
          )
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders(data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' }
      case 'processing':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' }
      case 'shipped':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' }
      case 'delivered':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' }
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' }
    }
  }

  const getDeliveryEstimate = (orderDate: string) => {
    const date = new Date(orderDate)
    const deliveryStart = new Date(date)
    deliveryStart.setDate(date.getDate() + 3)
    const deliveryEnd = new Date(date)
    deliveryEnd.setDate(date.getDate() + 5)

    return `${deliveryStart.toLocaleDateString()} - ${deliveryEnd.toLocaleDateString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-32 h-32 border-8 border-[#8BC34A]/20 border-t-[#8BC34A] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-[#8BC34A]" />
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-600 animate-pulse">
            Loading your orders...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-[#2d2d2d] mb-2">My Orders</h1>
          <p className="text-sm text-gray-500">Track and manage all your orders</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {orders.length === 0 ? (
          /* Enhanced Empty State */
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-12">
            <div className="text-center">
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/20 to-[#7CB342]/20 rounded-full blur-3xl" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#2d2d2d] mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                You haven&apos;t placed any orders yet. Start shopping to see your orders here!
              </p>
              <a
                href="/store"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingBag className="h-5 w-5" />
                Explore Store
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusColor = getStatusColor(order.status)
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#8BC34A]/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-[#8BC34A]/5 to-[#7CB342]/5 p-6 border-b-2 border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center shadow-lg">
                          <ShoppingBag className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#2d2d2d]">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 mt-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4 text-[#8BC34A]" />
                              <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <CreditCard className="h-4 w-4 text-[#8BC34A]" />
                              <span className="font-semibold text-[#2d2d2d]">
                                {formatCurrency(order.total_amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border-2 ${statusColor.bg} ${statusColor.text} ${statusColor.border} shadow-sm`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Truck className="h-4 w-4 text-[#8BC34A]" />
                          <span>Expected: {getDeliveryEstimate(order.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border-2 border-transparent hover:border-[#8BC34A]/30 transition-all duration-300"
                      >
                        <div className="relative w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              className="object-cover p-2"
                            />
                          ) : (
                            <Package className="h-10 w-10 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#2d2d2d] text-lg">
                            {item.product_name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">
                              Unit: {formatCurrency(item.price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg text-[#8BC34A]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Subtotal</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="px-6 pb-6">
                      <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-blue-900 mb-2">Shipping Address</h4>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p className="font-medium">{order.shipping_address.address_line_1}</p>
                            {order.shipping_address.address_line_2 && (
                              <p>{order.shipping_address.address_line_2}</p>
                            )}
                            <p>{order.shipping_address.street_address}</p>
                            <p>
                              {order.shipping_address.city}, {order.shipping_address.state}{' '}
                              {order.shipping_address.zip_code}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
