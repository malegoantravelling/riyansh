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

function resolveApiBase(): string {
  const configured =
    process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000'
  if (typeof window === 'undefined') return configured
  try {
    const conf = new URL(configured)
    return `${window.location.protocol}//${window.location.hostname}:${conf.port || '4000'}`
  } catch {
    return configured
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const toast = useToast()
  const { items, isLoaded, syncCart } = useCart()
  const { user, accessToken, loading: authLoading } = useAuth()

  const [firstname, setFirstname] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!accessToken) {
      router.replace('/login?next=/checkout')
      return
    }
    if (items.length === 0) {
      toast.error('Cart empty', 'Add products before checkout.')
      router.push('/cart')
      return
    }

    setSubmitting(true)
    try {
      await syncCart()

      const apiBase = resolveApiBase()
      const siteUrl = window.location.origin

      const shipping_address = {
        firstname,
        phone,
        address1,
        city,
        state,
        zipcode: pincode,
        pincode,
        country: 'India',
      }

      const res = await fetch(`${apiBase}/api/orders/create-payu-order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipping_address,
          billing_address: shipping_address,
          notes,
          site_url: siteUrl,
          api_base: apiBase,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start payment')
      }

      try {
        sessionStorage.setItem(
          'riyansh_payu_pending',
          JSON.stringify({
            order_id: data.order_id,
            txnid: data.txnid || data.fields?.txnid,
            at: Date.now(),
          })
        )
      } catch {
        // ignore
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.payment_url

      Object.entries(data.fields || {}).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = String(value ?? '')
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (err: any) {
      console.error(err)
      toast.error('Checkout failed', err.message || 'Could not start PayU payment')
      setSubmitting(false)
    }
  }

  if (authLoading || !isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5B8C51]/20 border-t-[#5B8C51] rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#787878]">Your cart is empty.</p>
        <Link href="/store">
          <Button className="bg-[#5B8C51] hover:bg-[#4E7A45]">Continue shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FAF8F2_0%,#ffffff_40%)]">
      <div className="bg-[#FAF9F5] border-b border-gray-200 py-3 text-center text-sm">
        <Link href="/cart" className="hover:text-[#5B8C51]">
          Cart
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="font-bold">Checkout</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-5 gap-8">
        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-4 bg-white border border-[#EEEEEE] p-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Shipping details</h1>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" required value={firstname} onChange={(e) => setFirstname(e.target.value)} />
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
            <Input id="address1" required value={address1} onChange={(e) => setAddress1(e.target.value)} />
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
              <Input id="pincode" required value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Order notes (optional)</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 bg-[#5B8C51] hover:bg-[#4E7A45] text-white"
          >
            {submitting ? 'Redirecting to PayU…' : `Pay ₹${subtotal.toLocaleString('en-IN')} with PayU`}
          </Button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#FAF9F5] border border-[#EEEEEE] p-6 h-fit">
            <h2 className="font-bold text-lg mb-4">Order summary</h2>
            <ul className="space-y-3 mb-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 text-sm">
                  <div className="relative w-14 h-14 bg-white border shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-[#787878]">
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
