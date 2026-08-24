'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Minus, Package, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { Reveal } from '@/components/motion/Reveal'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

function formatInr(amount: number) {
  return `₹ ${amount.toLocaleString('en-IN')}`
}

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const [orderNote, setOrderNote] = useState('')

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

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
    <div className="page-shell text-evergreen pb-28 lg:pb-16">
      <div className="container-editorial py-10 sm:py-14">
        <BlurFade>
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-dusty-olive" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-evergreen">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="font-medium text-evergreen">Cart</span>
          </nav>

          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-3">Cart</p>
            <h1 className="font-display text-3xl font-medium tracking-tight text-evergreen sm:text-4xl lg:text-5xl">
              Your cart
            </h1>
            <p className="mt-3 text-sm text-dusty-olive sm:text-base">
              {items.length === 0
                ? 'No items yet — explore the store when you are ready.'
                : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} ready for checkout.`}
            </p>
          </div>
        </BlurFade>

        {items.length === 0 ? (
          <BlurFade delay={0.08}>
            <div className="surface-glass mx-auto max-w-md rounded-3xl px-8 py-14 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-jade/40">
                <ShoppingBag className="h-7 w-7 text-evergreen/50" />
              </div>
              <h2 className="font-display text-2xl font-medium text-evergreen">Your cart is empty</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-dusty-olive">
                Looks like you have not added any wellness essentials yet.
              </p>
              <Link href="/store" className="mt-8 inline-block">
                <Button size="lg" className="rounded-full px-8">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </BlurFade>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-4 lg:col-span-7">
              {items.map((item, index) => {
                const href = `/products/${item.slug || item.id}`
                const sizeLabel = item.name.toLowerCase().includes('juice') ? '500ML' : '60 Capsules'
                const lineTotal = item.price * item.quantity

                return (
                  <Reveal key={item.id} delay={index * 0.06}>
                    <article className="surface-glass group rounded-2xl p-4 transition-shadow duration-300 hover:shadow-lift sm:p-5">
                      <div className="flex gap-4 sm:gap-5">
                        <Link
                          href={href}
                          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-evergreen/8 bg-[#f7f8f5] sm:h-28 sm:w-28"
                        >
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              sizes="112px"
                              className="object-contain p-2 transition-transform duration-500 ease-premium group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-8 w-8 text-dusty-olive/40" />
                            </div>
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={href}
                                className="font-display text-base font-medium leading-snug text-evergreen transition-colors hover:text-evergreen-mid sm:text-lg"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-1 text-xs text-dusty-olive">Size: {sizeLabel}</p>
                              <p className="mt-2 text-sm font-semibold text-evergreen">
                                {formatInr(item.price)}
                              </p>
                            </div>
                            <p className="shrink-0 font-display text-base font-medium text-evergreen sm:text-lg">
                              {formatInr(lineTotal)}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-evergreen/15 bg-white/80">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-evergreen transition-colors hover:bg-jade/50"
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-evergreen">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-evergreen transition-colors hover:bg-jade/50"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-dusty-olive transition-colors hover:text-evergreen"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                )
              })}

              <Reveal delay={0.08}>
                <div className="surface-glass rounded-2xl p-5 sm:p-6">
                  <label htmlFor="order-note" className="font-display text-base font-medium text-evergreen">
                    Add a note to your order
                  </label>
                  <p className="mt-1 text-xs text-dusty-olive">Optional — shared with your order at checkout.</p>
                  <textarea
                    id="order-note"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Delivery preference, gift message, or special request…"
                    rows={4}
                    className="mt-4 w-full resize-y rounded-xl border border-evergreen/15 bg-white/90 px-4 py-3 text-sm text-evergreen placeholder:text-dusty-olive/70 focus:border-evergreen/30 focus:outline-none focus:ring-2 focus:ring-evergreen/10"
                  />
                </div>
              </Reveal>

              <div className="lg:hidden">
                <Link href="/store">
                  <Button variant="outline" size="lg" className="w-full rounded-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            <aside className="hidden lg:col-span-5 lg:block">
              <Reveal delay={0.1}>
                <div className="surface-glass sticky top-28 rounded-3xl p-6 shadow-soft lg:p-7">
                  <h2 className="font-display text-xl font-medium text-evergreen">Order summary</h2>
                  <div className="mt-6 space-y-3 border-b border-evergreen/10 pb-5 text-sm">
                    <div className="flex items-center justify-between text-dusty-olive">
                      <span>
                        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                      </span>
                      <span className="font-semibold text-evergreen">{formatInr(subtotal)}</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-evergreen">Total</span>
                    <span className="font-display text-2xl font-medium text-evergreen">
                      {formatInr(subtotal)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-dusty-olive">Shipping & taxes calculated at checkout.</p>

                  <div className="mt-7 space-y-3">
                    <ShimmerButton onClick={handleCheckout} size="lg" className="w-full rounded-full">
                      Checkout
                    </ShimmerButton>
                    <Link href="/store" className="block">
                      <Button variant="outline" size="lg" className="w-full rounded-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        )}
      </div>

      {/* Mobile sticky checkout bar */}
      {items.length > 0 && (
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-30 border-t border-evergreen/10 bg-white/90 px-4 py-3 backdrop-blur-xl lg:hidden',
            'pb-[max(0.75rem,env(safe-area-inset-bottom))]'
          )}
        >
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.14em] text-dusty-olive">Subtotal</p>
              <p className="font-display text-lg font-medium text-evergreen">{formatInr(subtotal)}</p>
            </div>
            <ShimmerButton onClick={handleCheckout} className="shrink-0 rounded-full px-6">
              Checkout
            </ShimmerButton>
          </div>
        </div>
      )}
    </div>
  )
}
