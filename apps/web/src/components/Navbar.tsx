'use client'

import Link from 'next/link'
import { ShoppingCart, User, ChevronDown, Menu, X, CreditCard, MapPin, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { cartCount } = useCart()
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/store', label: 'Store' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Top Bar */}

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100'
            : 'bg-white/70 backdrop-blur-md border-b border-gray-100/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <span className="text-3xl font-extrabold tracking-tight">
                  <span className="text-[#2d2d2d]">RIY</span>
                  <span className="text-[#8BC34A]">ANSH</span>
                </span>
                {/* <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] group-hover:w-full transition-all duration-300" /> */}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 font-semibold text-sm transition-all duration-300 rounded-lg group ${
                    pathname === link.href
                      ? 'text-[#8BC34A]'
                      : 'text-[#2d2d2d] hover:text-[#8BC34A]'
                  }`}
                >
                  {link.label}
                  <div className="absolute inset-0 bg-[#8BC34A]/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <Link href="/cart" className="relative group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full text-[#2d2d2d] hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] transition-all duration-300">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#2d2d2d] hover:bg-[#8BC34A]/10 transition-all duration-300 border-2 border-transparent hover:border-[#8BC34A]/20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold max-w-[100px] truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        showDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                      <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden animate-fade-in">
                        <div className="p-2">
                          {[
                            { href: '/account/profile', label: 'My Profile', icon: User },
                            { href: '/account/orders', label: 'My Orders', icon: ShoppingCart },
                            {
                              href: '/account/transactions',
                              label: 'Transactions',
                              icon: CreditCard,
                            },
                            { href: '/account/addresses', label: 'Addresses', icon: MapPin },
                          ].map((item) => (
                            <button
                              key={item.href}
                              onClick={() => handleNavigation(item.href)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#2d2d2d] hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] rounded-xl transition-all duration-300"
                            >
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </button>
                          ))}
                          <hr className="my-2 border-gray-100" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" className="hidden sm:block">
                  <Button className="rounded-xl px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:text-white">
                    Login
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#2d2d2d] hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] transition-all duration-300"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    pathname === link.href
                      ? 'bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white shadow-lg'
                      : 'text-[#2d2d2d] hover:bg-[#8BC34A]/10 hover:text-[#8BC34A]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <hr className="my-4 border-gray-100" />

              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-full flex items-center justify-center text-white font-bold">
                      {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#2d2d2d]">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {[
                    { href: '/account/profile', label: 'My Profile' },
                    { href: '/account/orders', label: 'My Orders' },
                    { href: '/account/transactions', label: 'Transactions' },
                    { href: '/account/addresses', label: 'Addresses' },
                  ].map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        router.push(item.href)
                      }}
                      className="w-full text-left block px-4 py-3 text-sm font-medium text-[#2d2d2d] hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] rounded-xl transition-all duration-300"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl py-6 font-semibold shadow-lg">Login</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
