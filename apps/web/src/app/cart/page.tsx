'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Package } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const [orderNote, setOrderNote] = useState('')

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    if (orderNote) {
      try {
        sessionStorage.setItem('riyansh_checkout_note', orderNote)
      } catch {
        // ignore
      }
    }
    if (!user) {
      router.push('/login?next=/checkout')
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* Top Breadcrumb Header Bar */}
      <div className="bg-[#FAF9F5] border-b border-gray-200 py-3 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs sm:text-sm text-gray-600 font-medium">
          <Link href="/" className="hover:text-[#5B8C51] transition-colors">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#1A1A1A] font-bold">Your Shopping Cart</span>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#1A1A1A] mb-8 sm:mb-12">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-[#FAF9F5] rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto my-8">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link href="/store">
              <Button className="bg-[#5B8C51] hover:bg-[#4E7A45] text-white px-6 py-2 text-xs sm:text-sm font-semibold rounded">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Cart Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#FAF9F5] border-b border-gray-200 text-xs sm:text-sm font-bold text-[#1A1A1A]">
                    <th className="py-4 px-6 w-5/12">Product</th>
                    <th className="py-4 px-6 w-2/12">Price</th>
                    <th className="py-4 px-6 w-3/12 text-center">Quantity</th>
                    <th className="py-4 px-6 w-2/12 text-right">Total</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* Product Column */}
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/products/${item.slug || item.id}`}
                            className="shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 bg-[#F8F8F6] rounded-md overflow-hidden p-2 flex items-center justify-center border border-gray-100 group"
                          >
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-300" />
                            )}
                          </Link>

                          <div className="space-y-1">
                            <Link
                              href={`/products/${item.slug || item.id}`}
                              className="font-bold text-[#1A1A1A] hover:text-[#5B8C51] transition-colors leading-snug line-clamp-2 text-sm sm:text-base"
                            >
                              {item.name}
                            </Link>
                            <p className="text-[11px] sm:text-xs text-gray-400 font-medium">
                              Size: {item.name.toLowerCase().includes('juice') ? '500ML' : '60 Capsules'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="py-6 px-6 font-bold text-[#1A1A1A] text-sm sm:text-base whitespace-nowrap">
                        ₹ {item.price.toLocaleString()}.00
                      </td>

                      {/* Quantity Column */}
                      <td className="py-6 px-6 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-2">
                          <div className="inline-flex items-center bg-[#F4F4F0] border border-gray-200 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold transition-colors text-sm"
                            >
                              -
                            </button>
                            <span className="w-9 text-center font-bold text-sm text-[#1A1A1A]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="bg-[#5B8C51] hover:bg-[#4E7A45] text-white text-xs font-semibold px-4 py-1 rounded transition-colors shadow-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </td>

                      {/* Total Column */}
                      <td className="py-6 px-6 text-right font-bold text-[#1A1A1A] text-sm sm:text-base whitespace-nowrap">
                        ₹ {(item.price * item.quantity).toLocaleString()}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom 2-Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
              {/* Left Column: Order Notes & Continue Shopping */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A]">
                  Add a note to your order
                </h3>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="Write note"
                  rows={5}
                  className="w-full bg-[#F9F9F7] border border-gray-200 rounded-md p-4 text-xs sm:text-sm text-[#1A1A1A] placeholder-gray-400 focus:bg-white focus:border-gray-300 focus:outline-none transition-all resize-y"
                />
                <div className="pt-2">
                  <Link href="/store">
                    <Button className="bg-[#5B8C51] hover:bg-[#4E7A45] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded shadow-sm transition-all">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Sub Total & Check Out */}
              <div className="md:col-span-5 space-y-4 md:text-right">
                <div className="flex items-center justify-between md:justify-end gap-6 text-base sm:text-lg">
                  <span className="font-bold text-[#1A1A1A]">Sub Total</span>
                  <span className="font-bold text-[#1A1A1A] text-xl sm:text-2xl">
                    ₹ {calculateSubtotal().toLocaleString()}.00
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Shipping &amp; taxes calculated at checkout
                </p>
                <div className="pt-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#5B8C51] hover:bg-[#4E7A45] text-white font-bold text-sm sm:text-base py-3 rounded shadow-sm transition-all"
                  >
                    Check Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
