'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, Phone, Menu, X, User, LogOut, Package } from 'lucide-react'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useAuth } from '@/contexts/AuthContext'

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

  const handleSignOut = async () => {
    setAccountOpen(false)
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="w-full relative bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <div className="bg-[#F6F0E2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-[0.08em] uppercase text-[#555555] hover:text-ayurveda-green transition-colors relative"
            >
              <Heart className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="ml-1 bg-ayurveda-green text-white text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">
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
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-[0.08em] uppercase text-[#555555] hover:text-ayurveda-green transition-colors"
                    >
                      <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span className="hidden sm:inline max-w-[120px] truncate">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account'}
                      </span>
                    </button>
                    {accountOpen && (
                      <div className="absolute left-0 top-full mt-2 z-50 w-48 bg-white border border-[#EEEEEE] shadow-lg py-1">
                        <Link
                          href="/account/orders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-[#333] hover:bg-[#F6F0E2]"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#333] hover:bg-[#F6F0E2]"
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
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium tracking-[0.08em] uppercase text-[#555555] hover:text-ayurveda-green transition-colors"
                  >
                    <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          <Link
            href="/cart"
            className="shrink-0 h-9 inline-flex items-center gap-1.5 bg-ayurveda-green text-white px-4 text-[12px] font-semibold tracking-[0.1em] uppercase hover:bg-ayurveda-green-dark transition-colors"
          >
            <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
            <span>
              Cart
              {cartCount > 0 ? (
                <span className="ml-1 normal-case tracking-normal">({cartCount})</span>
              ) : null}
            </span>
          </Link>
        </div>
      </div>

      <div className="bg-white border-b border-[#EEEEEE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <Link href="/" className="flex flex-col shrink-0">
            <span className="text-[26px] lg:text-[28px] leading-none font-extrabold tracking-tight">
              <span className="text-[#222222]">RIY</span>
              <span className="text-ayurveda-green">ANSH</span>
            </span>
            <span className="mt-1 text-[11px] tracking-[0.18em] uppercase text-[#999999]">
              Health Care At A Click
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
            <a
              href="tel:+918605911293"
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            >
              <Phone className="h-7 w-7 text-ayurveda-green shrink-0" strokeWidth={1.25} />
              <span className="block">
                <span className="block text-[13px] leading-tight text-[#888888]">
                  Order Online or Call Us
                </span>
                <span className="block text-[15px] font-semibold text-[#222222] tracking-wide">
                  +91 8605911293
                </span>
              </span>
            </a>
          </div>

          <div className="relative flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center w-9 h-9 text-[#222222]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <nav className="bg-ayurveda-green">
        <div className="max-w-[1200px] mx-auto px-2 sm:px-4">
          <ul className="hidden lg:flex items-stretch justify-center h-10">
            {categoryLinks.map((link) => {
              const active = link.match(pathname)
              return (
                <li key={link.label} className="flex">
                  <Link
                    href={link.href}
                    className={`flex items-center px-2.5 xl:px-3.5 text-[14px] font-medium text-white whitespace-nowrap transition-colors ${
                      active ? 'bg-black/15' : 'hover:bg-black/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {categoryLinks.map((link) => {
              const active = link.match(pathname)
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 text-[15px] font-medium rounded ${
                    active
                      ? 'bg-ayurveda-green text-white'
                      : 'text-[#333333] hover:bg-[#F6F0E2] hover:text-ayurveda-green'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="pt-3 mt-2 border-t border-gray-100 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-[#666666]"
                  >
                    My Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      void handleSignOut()
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-[#666666]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-[#666666]"
                >
                  Login / Sign up
                </Link>
              )}
              <a
                href="tel:+918605911293"
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#666666]"
              >
                <Phone className="h-4 w-4 text-ayurveda-green" />
                +91 8605911293
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
