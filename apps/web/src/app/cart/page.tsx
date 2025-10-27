'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Truck,
  Shield,
  Package,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url?: string
  }
}

export default function CartPage() {
  const router = useRouter()
  const { refreshCartCount } = useCart()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) {
      setUser(session.user)
      await fetchCartItems()
    }
    setLoading(false)
  }

  const fetchCartItems = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const { data, error } = await supabase
          .from('cart_items')
          .select(
            `
            *,
            product:products(*)
          `
          )
          .eq('user_id', session.user.id)

        if (error) throw error
        setCartItems(data || [])
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
      await refreshCartCount()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
      await refreshCartCount()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    // Redirect to checkout page
    router.push('/checkout')
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
            Loading your cart...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-full mb-6 shadow-2xl">
            <ShoppingBag className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#2d2d2d] mb-4">Please Login</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sign in to view your cart and complete your purchase
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="px-8 rounded-xl shadow-lg hover:shadow-xl">
              Login to Continue
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#2d2d2d] mb-2">Shopping Cart</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-[#8BC34A] transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[#2d2d2d] font-semibold">Cart</span>
              </div>
            </div>
            <Link href="/store">
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl border-2 hover:border-[#8BC34A] hover:bg-transparent hover:text-[#8BC34A] hover:shadow-sm hover:scale-100"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          /* Enhanced Empty Cart State */
          <div className="text-center py-20">
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/20 to-[#7CB342]/20 rounded-full blur-3xl" />
              <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#2d2d2d] mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to find
              amazing products!
            </p>
            <Link href="/store">
              <Button size="lg" className="px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header */}
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#2d2d2d]">Cart Items</h2>
                      <p className="text-sm text-gray-500">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:border-[#8BC34A]/30"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Product Image */}
                        <Link
                          href={`/products/${item.product.id}`}
                          className="relative w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300"
                        >
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              fill
                              className="object-contain p-4"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="group/link inline-block"
                          >
                            <h3 className="text-xl font-bold text-[#2d2d2d] mb-2 group-hover/link:text-[#8BC34A] transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 mb-3">
                            SKU: {item.product.id.slice(0, 8)}
                          </p>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                              <p className="text-2xl font-bold text-[#8BC34A]">
                                {formatCurrency(item.product.price)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-[#8BC34A] transition-colors">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-12 h-12 flex items-center justify-center text-[#2d2d2d] hover:bg-[#8BC34A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-l-xl"
                            >
                              <Minus className="h-5 w-5" />
                            </button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, parseInt(e.target.value) || 1)
                              }
                              className="w-16 h-12 text-center border-0 focus:ring-0 bg-transparent text-lg font-bold"
                              min="1"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-12 h-12 flex items-center justify-center text-[#2d2d2d] hover:bg-[#8BC34A] hover:text-white transition-all rounded-r-xl"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* Total Price & Actions */}
                        <div className="flex flex-col items-end gap-4 min-w-[140px]">
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className="text-2xl font-bold text-[#2d2d2d]">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-12 h-12 flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] p-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Tag className="h-6 w-6" />
                      Order Summary
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold text-[#2d2d2d]">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-bold text-[#8BC34A] flex items-center gap-1">
                        <Truck className="h-5 w-5" />
                        Free
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#2d2d2d]">Total</span>
                      <span className="text-3xl font-bold text-[#8BC34A]">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      onClick={handleCheckout}
                      size="lg"
                      className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:text-white mt-6"
                      disabled={loading || cartItems.length === 0}
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </Button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-[#8BC34A]/10 rounded-xl flex items-center justify-center mb-2">
                          <Shield className="h-6 w-6 text-[#8BC34A]" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Secure</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-[#8BC34A]/10 rounded-xl flex items-center justify-center mb-2">
                          <Truck className="h-6 w-6 text-[#8BC34A]" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Fast Ship</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto bg-[#8BC34A]/10 rounded-xl flex items-center justify-center mb-2">
                          <Package className="h-6 w-6 text-[#8BC34A]" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Quality</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo Code Card */}
                <div className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/10 rounded-2xl border-2 border-[#8BC34A]/20 p-6">
                  <h4 className="font-bold text-[#2d2d2d] mb-3 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#8BC34A]" />
                    Have a promo code?
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      className="flex-1 rounded-xl border-2 border-[#8BC34A]/30 focus:border-[#8BC34A]"
                    />
                    <Button
                      variant="outline"
                      className="rounded-xl border-2 border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white px-6"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
