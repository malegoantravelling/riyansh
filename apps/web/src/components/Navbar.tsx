'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, Menu, X, User, LogOut, Package } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const categoryLinks = [
  { href: '/', label: 'Home', match: (path: string) => path === '/' },
  { href: '/store', label: 'Store', match: (path: string) => path.startsWith('/store') },
  { href: '/wellness', label: 'Wellness', match: (path: string) => path.startsWith('/wellness') },
  { href: '/about', label: 'About us', match: (path: string) => path.startsWith('/about') },
  {
    href: '/contact',
    label: 'E-Consultation',
    match: (path: string) => path.startsWith('/contact'),
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setAccountOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleSignOut = async () => {
    setAccountOpen(false)
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-[40] w-full px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={cn(
            'pointer-events-auto mx-auto flex max-w-[1280px] items-center justify-between gap-3 rounded-full border transition-all duration-500 ease-premium',
            scrolled
              ? 'h-14 border-evergreen/15 bg-white/55 px-3 shadow-glass backdrop-blur-2xl supports-[backdrop-filter]:bg-white/40 sm:px-5'
              : 'h-16 border-transparent bg-transparent px-2 sm:px-4'
          )}
        >
          <Link href="/" className="flex shrink-0 flex-col pl-1">
            <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              <span className="text-charcoal">RIY</span>
              <span className="text-forest">ANSH</span>
            </span>
            {!scrolled && (
              <span className="hidden text-[9px] uppercase tracking-[0.2em] text-stone sm:block">
                Health Care At A Click
              </span>
            )}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {categoryLinks.map((link) => {
              const active = link.match(pathname)
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors',
                    active ? 'text-forest' : 'text-charcoal/70 hover:text-forest'
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-forest" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">

            <Link
              href="/wishlist"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal/80 transition-colors hover:bg-forest/8 hover:text-forest"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {!loading && (
              <div className="relative">
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAccountOpen((v) => !v)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full px-2 text-charcoal/80 transition-colors hover:bg-forest/8 hover:text-forest sm:px-3"
                      aria-expanded={accountOpen}
                      aria-haspopup="menu"
                    >
                      <User className="h-4.5 w-4.5" strokeWidth={1.5} />
                      <span className="hidden max-w-[100px] truncate text-xs font-medium sm:inline">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account'}
                      </span>
                    </button>
                    {accountOpen && (
                      <div className="glass-panel-strong absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl py-1 shadow-lift">
                        <Link
                          href="/account/orders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-forest/8"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-forest/8"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full px-2 text-charcoal/80 transition-colors hover:bg-forest/8 hover:text-forest sm:px-3"
                  >
                    <User className="h-4.5 w-4.5" strokeWidth={1.5} />
                    <span className="hidden text-xs font-medium sm:inline">Login</span>
                  </Link>
                )}
              </div>
            )}

            <Link
              href="/cart"
              className="magnetic-cta relative inline-flex h-10 items-center gap-2 rounded-full bg-forest px-3.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-forest-deep"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={cn(
          'fixed inset-0 z-[50] bg-ivory/95 backdrop-blur-xl transition-all duration-500 ease-premium lg:hidden',
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-6">
          <div className="mb-10 flex items-center justify-between">
            <span className="font-display text-2xl font-semibold">
              <span className="text-charcoal">RIY</span>
              <span className="text-forest">ANSH</span>
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-forest/15"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {categoryLinks.map((link, i) => {
              const active = link.match(pathname)
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'font-display text-3xl font-medium transition-all',
                    active ? 'text-forest' : 'text-charcoal/80',
                    mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  )}
                  style={{ transitionDelay: mobileMenuOpen ? `${80 + i * 60}ms` : '0ms' }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="space-y-3 border-t border-forest/10 pt-6">
            {user ? (
              <>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone"
                >
                  My Orders
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    void handleSignOut()
                  }}
                  className="block text-sm text-stone"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-stone"
              >
                Login / Sign up
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
