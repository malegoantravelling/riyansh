'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'

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

interface Address {
  id: string
  address_line_1: string
  address_line_2?: string
  street_address: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
}

export default function CartPage() {
  const toast = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
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
      await Promise.all([fetchCartItems(), fetchAddresses()])
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

  const fetchAddresses = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('is_default', { ascending: false })

        if (error) throw error
        setAddresses(data || [])

        // Auto-select default address
        const defaultAddress = data?.find((addr) => addr.is_default)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress.id)
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
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
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase.from('cart_items').delete().eq('id', itemId)

      if (error) throw error
      await fetchCartItems()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.warning('Address Required', 'Please select a delivery address to proceed')
      return
    }

    try {
      // Here you would integrate with Razorpay for payment
      // For now, we'll just create the order
      const selectedAddr = addresses.find((addr) => addr.id === selectedAddress)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          shipping_address: selectedAddr,
          billing_address: selectedAddr,
        }),
      })

      if (response.ok) {
        toast.success('Order Placed!', 'Your order has been placed successfully')
        await fetchCartItems() // Cart will be empty after order
      } else {
        throw new Error('Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Order Failed', 'Failed to place order. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8BC34A]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to login to view your cart</p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white py-8 border-b border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#333333]">Shopping Cart</h1>
          <p className="text-[#666666] mt-2">Home / Cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link href="/store">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Cart Items ({cartItems.length})</h2>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-[#8BC34A] font-semibold">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          variant="outline"
                          size="sm"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="outline"
                          size="sm"
                          className="mt-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Address Selection */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Delivery Address</h3>

                {addresses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">No addresses found</p>
                    <Link href="/account/addresses">
                      <Button variant="outline" size="sm">
                        Add Address
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label key={address.id} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{address.address_line_1}</p>
                          {address.address_line_2 && <p>{address.address_line_2}</p>}
                          <p>{address.street_address}</p>
                          <p>
                            {address.city}, {address.state} {address.zip_code}
                          </p>
                          {address.is_default && (
                            <span className="inline-block bg-[#8BC34A] text-white text-xs px-2 py-1 rounded mt-1">
                              Default
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                    <Link href="/account/addresses">
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Manage Addresses
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-[#8BC34A]">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={!selectedAddress || cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
