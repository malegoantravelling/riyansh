'use client'

import Link from 'next/link'
import {
  ShoppingCart,
  User,
  Heart,
  Phone,
  Menu,
  X,
  CreditCard,
  MapPin,
  LogOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

const categoryLinks = [
  { href: '/', label: 'Home', match: (path: string) => path === '/' },
  { href: '/store', label: 'Store', match: (path: string) => path.startsWith('/store') },
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
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
    router.push('/')
  }

  const handleNavigation = (href: string) => {
    setShowDropdown(false)
    router.push(href)
  }

  return (
    <header className="w-full relative bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* ── Tier 1: Utility bar ── */}
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
          </div>

          {/* Cart — aligned to content container */}
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

      {/* ── Tier 2: Brand + contact + account ── */}
      <div className="bg-white border-b border-[#EEEEEE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          {/* Logo */}
          <Link href="/" className="flex flex-col shrink-0">
            <span className="text-[26px] lg:text-[28px] leading-none font-extrabold tracking-tight">
              <span className="text-[#222222]">RIY</span>
              <span className="text-ayurveda-green">ANSH</span>
            </span>
            <span className="mt-1 text-[11px] tracking-[0.18em] uppercase text-[#999999]">
              Health Care At A Click
            </span>
          </Link>

          {/* Contact */}
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

          {/* Account (replaces search) + mobile menu */}
          <div className="relative flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            {user ? (
              <button
                type="button"
                onClick={() => setShowDropdown((v) => !v)}
                className="inline-flex items-center gap-2 h-9 px-3 sm:px-4 rounded-full border border-[#DDDDDD] bg-white text-[13px] font-semibold tracking-[0.06em] uppercase text-[#333333] hover:border-ayurveda-green hover:text-ayurveda-green transition-colors"
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Account</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 h-9 px-3 sm:px-4 rounded-full border border-[#DDDDDD] bg-white text-[13px] font-semibold tracking-[0.06em] uppercase text-[#333333] hover:border-ayurveda-green hover:text-ayurveda-green transition-colors"
                >
                  <User className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">Account</span>
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center w-9 h-9 text-[#222222]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Account dropdown — anchored to right-side Account control */}
            {showDropdown && user && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-2">
                    {[
                      { href: '/account/profile', label: 'My Profile', icon: User },
                      { href: '/account/orders', label: 'My Orders', icon: ShoppingCart },
                      { href: '/account/transactions', label: 'Transactions', icon: CreditCard },
                      { href: '/account/addresses', label: 'Addresses', icon: MapPin },
                    ].map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleNavigation(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#333333] hover:bg-[#F6F0E2] hover:text-ayurveda-green rounded transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                    <hr className="my-1.5 border-gray-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Tier 3: Category nav ── */}
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

      {/* Mobile menu */}
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
              <a
                href="tel:+918605911293"
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#666666]"
              >
                <Phone className="h-4 w-4 text-ayurveda-green" />
                +91 8605911293
              </a>

              {user ? (
                <>
                  <Link
                    href="/account/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-ayurveda-green"
                  >
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-ayurveda-green"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-[#333333]"
                  >
                    Create An Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
