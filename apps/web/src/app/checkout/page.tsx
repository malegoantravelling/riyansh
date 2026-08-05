'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { openWhatsAppOrder } from '@/lib/whatsapp'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, isLoaded, clearCart } = useCart()
  const redirected = useRef(false)

  useEffect(() => {
    if (!isLoaded || redirected.current) return

    if (items.length === 0) {
      router.replace('/cart')
      return
    }

    redirected.current = true
    openWhatsAppOrder(
      items.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price }))
    )
    clearCart()
  }, [isLoaded, items, clearCart, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#5B8C51]/20 border-t-[#5B8C51] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-500">Opening WhatsApp...</p>
      </div>
    </div>
  )
}
