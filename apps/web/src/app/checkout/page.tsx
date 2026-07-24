'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag, ChevronLeft, HelpCircle } from 'lucide-react'
import Link from 'next/link'

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

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

const inputClass =
  'w-full px-3.5 py-3 text-sm text-[#1A1A1A] bg-[#F5F5F5] border border-[#E5E5E5] rounded-md placeholder:text-[#A3A3A3] focus:outline-none focus:bg-white focus:border-[#5B8C51] focus:ring-1 focus:ring-[#5B8C51] transition-colors'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [emailOffers, setEmailOffers] = useState(true)
  const [saveInfo, setSaveInfo] = useState(true)
  const [discountCode, setDiscountCode] = useState('')
  const [discountApplied, setDiscountApplied] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: 'India',
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

  const splitName = (fullName: string) => {
    const parts = (fullName || '').trim().split(/\s+/)
    if (parts.length === 0 || (parts.length === 1 && !parts[0])) {
      return { first_name: '', last_name: '' }
    }
    if (parts.length === 1) return { first_name: parts[0], last_name: '' }
    return { first_name: parts[0], last_name: parts.slice(1).join(' ') }
  }

  const fullName = () =>
    `${formData.first_name} ${formData.last_name}`.trim()

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      router.push('/auth/login')
      return
    }

    await Promise.all([
      fetchCartItems(session.user.id),
      fetchUserProfile(session.user.id, session.user.email || ''),
      fetchAddresses(session.user.id),
    ])
    setLoading(false)
  }

  const fetchCartItems = async (userId: string) => {
    try {
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
        .eq('user_id', userId)

      if (error) throw error

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

  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', userId)
        .single()

      if (error) throw error

      if (data) {
        const names = splitName(data.full_name || '')
        setFormData((prev) => ({
          ...prev,
          first_name: names.first_name,
          last_name: names.last_name,
          email: data.email || userEmail || '',
        }))
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchAddresses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })

      if (error) throw error
      setAddresses(data || [])

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const estimatedTax = () => Math.round(calculateTotal() * 0.05 * 100) / 100

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) return
    setDiscountApplied(true)
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.email.trim()) errors.email = 'Enter an email or phone number'
    if (!formData.first_name.trim()) errors.first_name = 'Enter a first name'
    if (!formData.last_name.trim()) errors.last_name = 'Enter a last name'
    if (!formData.address_line_1.trim()) errors.address_line_1 = 'Enter an address'
    if (!formData.street_address.trim()) errors.street_address = 'Enter a street address'
    if (!formData.city.trim()) errors.city = 'Enter a city'
    if (!formData.zip_code.trim()) errors.zip_code = 'Enter a pincode'
    if (!formData.state.trim()) errors.state = 'Select a state'
    if (!formData.phone.trim()) errors.phone = 'Enter a phone number'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

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

      const customerName = fullName()
      let addressId = selectedAddressId
      if (!addressId || showAddressForm) {
        if (saveInfo) {
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
              is_default: addresses.length === 0,
            })
            .select()
            .single()

          if (addressError) throw addressError
          addressId = newAddress.id
        }
      } else {
        const { error: updateError } = await supabase
          .from('user_addresses')
          .update({ phone: formData.phone })
          .eq('id', addressId)

        if (updateError) throw updateError
      }

      await supabase
        .from('users')
        .update({ full_name: customerName })
        .eq('id', session.user.id)

      const productNames = cartItems.map((item) => item.product.name)

      const billItems = cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        total: item.product.price * item.quantity,
        originalPrice: item.product.price,
      }))

      const subtotal = calculateTotal()

      const billText = billItems
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.name}\n   Qty: ${item.quantity} × ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.total)}`
        )
        .join('\n\n')

      const fullAddress = `${formData.address_line_1}${
        formData.address_line_2 ? ', ' + formData.address_line_2 : ''
      }, ${formData.street_address}, ${formData.city}, ${formData.state} ${formData.zip_code}, ${formData.country}`

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          (process.env.NODE_ENV === 'production'
            ? 'https://riyanshamrit.com'
            : 'http://0.0.0.0:4000')

        await fetch(`${apiUrl}/api/orders/whatsapp-notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            productNames,
            billItems,
            subtotal,
            customerName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            customerAddress: fullAddress,
            orderType: 'checkout',
          }),
        })
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError)
      }

      const whatsappMessage = `can you have the following products in stock = ${productNames.join(', ')}

Customer Details:
Name: ${customerName}
Email: ${formData.email}
Phone: ${formData.phone}
Address: ${fullAddress}

Order Bill:
${billText}

Subtotal: ${formatCurrency(subtotal)}`

      const encodedMessage = encodeURIComponent(whatsappMessage)
      const whatsappUrl = `https://wa.me/8605911293?text=${encodedMessage}`

      window.location.href = whatsappUrl
    } catch (error: any) {
      console.error('Error processing checkout:', error)
      alert(`Failed to process checkout: ${error.message || 'Please try again.'}`)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5B8C51]/20 border-t-[#5B8C51] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4 py-16 bg-[#FAF9F5] rounded-2xl border border-gray-200 my-8">
          <ShoppingBag className="h-16 w-16 text-[#5B8C51] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-6">
            Add some Ayurvedic products to your cart before checking out.
          </p>
          <Link href="/store">
            <button className="bg-[#5B8C51] hover:bg-[#4E7A45] text-white font-semibold px-6 py-2.5 rounded text-sm transition-all">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = calculateTotal()
  const taxHint = estimatedTax()

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Title + steps */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-[2rem] font-bold tracking-tight text-[#1A1A1A] mb-4">
            Information
          </h1>
          <nav className="flex items-center justify-center gap-2 text-sm flex-wrap" aria-label="Checkout steps">
            <Link href="/cart" className="text-[#5B8C51] hover:underline">
              Cart
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="font-semibold text-[#1A1A1A]">Information</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-400">Shipping</span>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-400">Payment</span>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ── LEFT: Contact + Shipping ── */}
            <div className="lg:col-span-7">
              <div className="border border-[#E8E8E8] rounded-lg bg-white p-5 sm:p-7 space-y-8">
                {/* Contact information */}
                <section>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Contact information</h2>
                    <p className="text-sm text-gray-500">
                      Already have an account?{' '}
                      <Link href="/auth/login" className="text-[#5B8C51] font-medium hover:underline">
                        Log in
                      </Link>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email or mobile phone number"
                        className={`${inputClass} ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
                        aria-label="Email or mobile phone number"
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email}</p>
                      )}
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={emailOffers}
                        onChange={(e) => setEmailOffers(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#5B8C51] accent-[#5B8C51]"
                      />
                      <span className="text-sm text-gray-600">Email me with news and offers</span>
                    </label>
                  </div>
                </section>

                {/* Shipping address */}
                <section>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Shipping address</h2>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="text-sm text-[#5B8C51] hover:underline"
                      >
                        {showAddressForm ? 'Use saved address' : '+ New address'}
                      </button>
                    )}
                  </div>

                  {/* Saved addresses */}
                  {addresses.length > 0 && !showAddressForm && (
                    <div className="space-y-3 mb-4">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-all ${
                            selectedAddressId === address.id
                              ? 'border-[#5B8C51] bg-[#5B8C51]/5'
                              : 'border-[#E5E5E5] hover:border-[#5B8C51]/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={() => handleAddressSelect(address.id)}
                            className="mt-1 h-4 w-4 text-[#5B8C51] accent-[#5B8C51]"
                          />
                          <div className="text-sm space-y-0.5">
                            <p className="font-medium text-[#1A1A1A]">{address.address_line_1}</p>
                            {address.address_line_2 && (
                              <p className="text-gray-500">{address.address_line_2}</p>
                            )}
                            <p className="text-gray-500">{address.street_address}</p>
                            <p className="text-gray-500">
                              {address.city}, {address.state} {address.zip_code}
                            </p>
                            {address.phone && (
                              <p className="text-gray-500">{address.phone}</p>
                            )}
                          </div>
                        </label>
                      ))}

                      {/* Phone still required when using saved address */}
                      <div>
                        <input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone"
                          className={`${inputClass} ${fieldErrors.phone ? 'border-red-400' : ''}`}
                        />
                        {fieldErrors.phone && (
                          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {(showAddressForm || addresses.length === 0) && (
                    <div className="space-y-3">
                      <div>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={inputClass}
                          aria-label="Country / region"
                        >
                          <option value="India">India</option>
                        </select>
                        <p className="mt-1 text-[11px] text-gray-400 px-0.5">Country / region</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            placeholder="First name"
                            className={`${inputClass} ${fieldErrors.first_name ? 'border-red-400' : ''}`}
                          />
                          {fieldErrors.first_name && (
                            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.first_name}</p>
                          )}
                        </div>
                        <div>
                          <input
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            className={`${inputClass} ${fieldErrors.last_name ? 'border-red-400' : ''}`}
                          />
                          {fieldErrors.last_name && (
                            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.last_name}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <input
                          name="address_line_1"
                          value={formData.address_line_1}
                          onChange={handleInputChange}
                          placeholder="Address"
                          className={`${inputClass} ${fieldErrors.address_line_1 ? 'border-red-400' : ''}`}
                        />
                        {fieldErrors.address_line_1 && (
                          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.address_line_1}</p>
                        )}
                      </div>

                      <div>
                        <input
                          name="address_line_2"
                          value={formData.address_line_2}
                          onChange={handleInputChange}
                          placeholder="Apartment, suite, etc. (optional)"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <input
                          name="street_address"
                          value={formData.street_address}
                          onChange={handleInputChange}
                          placeholder="Street / Area"
                          className={`${inputClass} ${fieldErrors.street_address ? 'border-red-400' : ''}`}
                        />
                        {fieldErrors.street_address && (
                          <p className="mt-1.5 text-xs text-red-600">{fieldErrors.street_address}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City"
                            className={`${inputClass} ${fieldErrors.city ? 'border-red-400' : ''}`}
                          />
                          {fieldErrors.city && (
                            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <input
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleInputChange}
                            placeholder="Pincode"
                            className={`${inputClass} ${fieldErrors.zip_code ? 'border-red-400' : ''}`}
                          />
                          {fieldErrors.zip_code && (
                            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.zip_code}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            className={`${inputClass} ${fieldErrors.state ? 'border-red-400' : ''}`}
                            aria-label="State"
                          >
                            <option value="">State</option>
                            {INDIAN_STATES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.state && (
                            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.state}</p>
                          )}
                        </div>
                        <div>
                          <input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone"
                            className={`${inputClass} ${fieldErrors.phone ? 'border-red-400' : ''}`}
                          />
                          {fieldErrors.phone && (
                            <p className="mt-1.5 text-xs text-red-600">{fieldErrors.phone}</p>
                          )}
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                        <input
                          type="checkbox"
                          checked={saveInfo}
                          onChange={(e) => setSaveInfo(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-[#5B8C51] accent-[#5B8C51]"
                        />
                        <span className="text-sm text-gray-600">
                          Save this information for next time
                        </span>
                      </label>
                    </div>
                  )}
                </section>

                {/* Footer actions */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                  <Link
                    href="/cart"
                    className="inline-flex items-center justify-center gap-1.5 text-sm text-[#5B8C51] hover:underline py-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Return to cart
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#5B8C51] hover:bg-[#4E7A45] text-white font-semibold text-sm px-8 py-3.5 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {submitting ? 'Processing...' : 'Continue to shipping'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div className="lg:col-span-5">
              <div className="border border-[#E8E8E8] rounded-lg bg-[#FAFAFA] p-5 sm:p-6 sticky top-6">
                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-[64px] w-[64px] rounded-md overflow-hidden bg-white border border-[#E5E5E5] flex-shrink-0">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                        <span className="absolute -top-1.5 -right-1.5 bg-[#5B8C51] text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>

                      <p className="text-sm font-medium text-[#1A1A1A] whitespace-nowrap">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Discount */}
                <div className="flex gap-2 mt-5 pt-5 border-t border-[#E8E8E8]">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value)
                      setDiscountApplied(false)
                    }}
                    placeholder="Discount code"
                    className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-md placeholder:text-[#A3A3A3] focus:outline-none focus:border-[#5B8C51]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="bg-[#5B8C51] hover:bg-[#4E7A45] text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discountApplied && (
                  <p className="mt-2 text-xs text-amber-700">
                    Discount codes are applied when your order is confirmed on WhatsApp.
                  </p>
                )}

                {/* Totals */}
                <div className="mt-5 pt-5 border-t border-[#E8E8E8] space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-medium text-[#1A1A1A]">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-600 inline-flex items-center gap-1">
                      Shipping
                      <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                    <span className="text-xs text-gray-500">Calculated at next step</span>
                  </div>

                  <div className="pt-3 border-t border-[#E8E8E8] flex justify-between items-start">
                    <div>
                      <p className="text-base font-bold text-[#1A1A1A]">Total</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Including {formatCurrency(taxHint)} in taxes
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#1A1A1A]">{formatCurrency(subtotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
