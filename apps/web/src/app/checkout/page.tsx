'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { CHECKOUT_SHIPPING_KEY, type ShippingDraft } from '@/lib/checkout'

export default function CheckoutPage() {
  const router = useRouter()
  const toast = useToast()
  const { items, isLoaded } = useCart()
  const { user, loading: authLoading } = useAuth()

  const [firstname, setFirstname] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace('/login?next=/checkout')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFirstname(String(user.user_metadata.full_name).split(' ')[0] || '')
    }
    try {
      const saved = sessionStorage.getItem(CHECKOUT_SHIPPING_KEY)
      if (saved) {
        const draft = JSON.parse(saved) as ShippingDraft
        if (draft.firstname) setFirstname(draft.firstname)
        if (draft.phone) setPhone(draft.phone)
        if (draft.address1) setAddress1(draft.address1)
        if (draft.city) setCity(draft.city)
        if (draft.state) setState(draft.state)
        if (draft.pincode) setPincode(draft.pincode)
        if (draft.notes) setNotes(draft.notes)
      }
      const note = sessionStorage.getItem('riyansh_checkout_note')
      if (note) {
        setNotes(note)
        sessionStorage.removeItem('riyansh_checkout_note')
      }
    } catch {
      // ignore
    }
  }, [user])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Cart empty', 'Add products before checkout.')
      router.push('/cart')
      return
    }

    const draft: ShippingDraft = {
      firstname: firstname.trim(),
      phone: phone.trim(),
      address1: address1.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      notes: notes.trim(),
    }

    try {
      sessionStorage.setItem(CHECKOUT_SHIPPING_KEY, JSON.stringify(draft))
    } catch {
      toast.error('Could not save address', 'Please try again.')
      return
    }

    router.push('/checkout/payment')
  }

  if (authLoading || !isLoaded) {
    return (
      <div className="page-canvas surface-mist">
        <div className="w-12 h-12 border-4 border-[#013220]/20 border-t-[#013220] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#80866e]">Your cart is empty.</p>
        <Link href="/store">
          <Button className="bg-[#013220] hover:bg-[#012418]">Continue shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="page-shell surface-band">
      <div className="border-b border-evergreen/10 bg-white/60 py-3 text-center text-sm backdrop-blur-sm">
        <Link href="/cart" className="hover:text-[#013220]">
          Cart
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold">Shipping</span>
        <span className="mx-2">&gt;</span>
        <span className="text-[#80866e]">Payment</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-5 gap-8">
        <form onSubmit={onSubmit} className="lg:col-span-3 surface-glass space-y-4 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-[#013220] mb-2">Shipping details</h1>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                required
                inputMode="tel"
                pattern="[0-9]{10}"
                placeholder="10-digit mobile"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address1">Address</Label>
            <Input
              id="address1"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" required value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" required value={state} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">PIN code</Label>
              <Input
                id="pincode"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Order notes (optional)</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <Button type="submit" className="w-full h-11 bg-[#013220] hover:bg-[#012418] text-white">
            Continue to payment
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="surface-glass h-fit rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-4">Order summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 text-sm">
                  <div className="relative w-14 h-14 bg-white border shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-[#80866e]">
                      Qty {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
