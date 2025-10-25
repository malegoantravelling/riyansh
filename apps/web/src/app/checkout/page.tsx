'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, MapPin, User, Mail, Phone, CreditCard, ChevronRight } from 'lucide-react'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image_url: string
  }
}

interface Address {
  id: string
  address_line_1: string
  address_line_2: string | null
  street_address: string
  city: string
  state: string
  zip_code: string
  phone: string | null
  is_default: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
  })

  useEffect(() => {
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    await Promise.all([fetchCartItems(), fetchUserProfile(), fetchAddresses()])
    setLoading(false)
  }

  const fetchCartItems = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from('cart_items')
        .select(
          `
          id,
          quantity,
          product:products (
            id,
            name,
            price,
            image_url
          )
        `
        )
        .eq('user_id', session.user.id)

      if (error) throw error

      // Transform the data to match CartItem interface
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
      }))

      setCartItems(transformedData)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single()

      if (error) throw error

      if (data) {
        setFormData((prev) => ({
          ...prev,
          full_name: data.full_name || '',
          email: data.email || session.user.email || '',
        }))
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchAddresses = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('is_default', { ascending: false })

      if (error) throw error
      setAddresses(data || [])

      // Auto-select default address or first address
      if (data && data.length > 0) {
        const defaultAddr = data.find((addr) => addr.is_default) || data[0]
        setSelectedAddressId(defaultAddr.id)
        populateFormWithAddress(defaultAddr)
      } else {
        setShowAddressForm(true)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    }
  }

  const populateFormWithAddress = (address: Address) => {
    setFormData((prev) => ({
      ...prev,
      phone: address.phone || '',
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
    }))
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    const address = addresses.find((addr) => addr.id === addressId)
    if (address) {
      populateFormWithAddress(address)
      setShowAddressForm(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.full_name || !formData.email || !formData.phone) {
      alert('Please fill in all required contact information')
      return
    }

    if (
      !formData.address_line_1 ||
      !formData.street_address ||
      !formData.city ||
      !formData.state ||
      !formData.zip_code
    ) {
      alert('Please fill in complete address information')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    try {
      setSubmitting(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        alert('Please login to continue')
        router.push('/auth/login')
        return
      }

      // Update or create address with phone number
      let addressId = selectedAddressId
      if (!addressId || showAddressForm) {
        // Create new address
        const { data: newAddress, error: addressError } = await supabase
          .from('user_addresses')
          .insert({
            user_id: session.user.id,
            address_line_1: formData.address_line_1,
            address_line_2: formData.address_line_2 || null,
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            phone: formData.phone,
            is_default: addresses.length === 0, // Make it default if it's the first address
          })
          .select()
          .single()

        if (addressError) throw addressError
        addressId = newAddress.id
      } else {
        // Update existing address with phone number
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update({ phone: formData.phone })
          .eq('id', addressId)

        if (updateError) throw updateError
      }

      // Get the full address object
      const selectedAddress = addresses.find((addr) => addr.id === addressId) || {
        id: addressId,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        phone: formData.phone,
        is_default: false,
      }

      // Create Razorpay order via API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${API_URL}/api/orders/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          shipping_address: selectedAddress,
          billing_address: selectedAddress,
          contact_info: {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Initialize Razorpay payment
      const options = {
        key: data.key_id,
        amount: data.amount * 100, // Amount in paise
        currency: data.currency,
        name: 'RIYANSH',
        description: 'Order Payment',
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${API_URL}/api/orders/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: data.order_id,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              alert('Payment successful! Your order has been placed.')
              router.push('/account/orders')
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error: any) {
            console.error('Payment verification error:', error)
            alert(`Payment verification failed: ${error.message}`)
          }
        },
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address_line_1}, ${formData.city}, ${formData.state}`,
        },
        theme: {
          color: '#8BC34A',
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false)
            alert('Payment cancelled. Your order is saved and you can complete payment later.')
          },
        },
      }

      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.')
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()

      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description}`)
        setSubmitting(false)
      })
    } catch (error: any) {
      console.error('Error processing checkout:', error)
      alert(`Failed to process checkout: ${error.message || 'Please try again.'}`)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8BC34A]"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to checkout</p>
          <Button
            onClick={() => router.push('/store')}
            className="bg-[#8BC34A] hover:bg-[#7CB342] text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Address Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Contact Information</h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="full_name"
                      className="text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <User className="h-4 w-4 mr-2 text-[#8BC34A]" />
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium mb-2 flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2 text-[#8BC34A]" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="text-gray-700 font-medium mb-2 flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-2 text-[#8BC34A]" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            {addresses.length > 0 && !showAddressForm && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Select Delivery Address</h2>
                    </div>
                    <Button
                      onClick={() => setShowAddressForm(true)}
                      variant="outline"
                      size="sm"
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    >
                      + New Address
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? 'border-[#8BC34A] bg-[#8BC34A]/5 shadow-md'
                          : 'border-gray-200 hover:border-[#8BC34A]/50 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={selectedAddressId === address.id}
                        onChange={() => handleAddressSelect(address.id)}
                        className="mt-1 h-5 w-5 text-[#8BC34A] focus:ring-[#8BC34A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <MapPin className="h-4 w-4 text-[#8BC34A]" />
                          <p className="font-semibold text-gray-900">{address.address_line_1}</p>
                        </div>
                        {address.address_line_2 && (
                          <p className="text-sm text-gray-600 ml-6">{address.address_line_2}</p>
                        )}
                        <p className="text-sm text-gray-600 ml-6">{address.street_address}</p>
                        <p className="text-sm text-gray-600 ml-6">
                          {address.city}, {address.state} {address.zip_code}
                        </p>
                        {address.phone && (
                          <p className="text-sm text-gray-600 ml-6 flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {address.phone}
                          </p>
                        )}
                        {address.is_default && (
                          <span className="inline-block bg-[#8BC34A] text-white text-xs px-3 py-1 rounded-full mt-2 ml-6">
                            Default Address
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Address Form */}
            {(showAddressForm || addresses.length === 0) && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Delivery Address</h2>
                    </div>
                    {addresses.length > 0 && (
                      <Button
                        onClick={() => setShowAddressForm(false)}
                        variant="outline"
                        size="sm"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        Use Saved Address
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="address_line_1" className="text-gray-700 font-medium mb-2">
                      Address Line 1 *
                    </Label>
                    <Input
                      id="address_line_1"
                      name="address_line_1"
                      value={formData.address_line_1}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                      placeholder="House/Flat No., Building Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address_line_2" className="text-gray-700 font-medium mb-2">
                      Address Line 2
                    </Label>
                    <Input
                      id="address_line_2"
                      name="address_line_2"
                      value={formData.address_line_2}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                      placeholder="Apartment, Suite, etc. (optional)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="street_address" className="text-gray-700 font-medium mb-2">
                      Street Address *
                    </Label>
                    <Input
                      id="street_address"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleInputChange}
                      required
                      className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                      placeholder="Street Name, Area"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-700 font-medium mb-2">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-gray-700 font-medium mb-2">
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                        placeholder="State"
                      />
                    </div>

                    <div>
                      <Label htmlFor="zip_code" className="text-gray-700 font-medium mb-2">
                        ZIP Code *
                      </Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange}
                        required
                        className="border-gray-300 focus:border-[#8BC34A] focus:ring-[#8BC34A]"
                        placeholder="ZIP"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Order Summary</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex space-x-3 pb-4 border-b border-gray-100">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute -top-2 -right-2 bg-[#8BC34A] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatCurrency(item.product.price)} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-[#8BC34A] mt-1">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-[#8BC34A]">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">Calculated at payment</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-[#8BC34A]">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#689F38] text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Payment
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
