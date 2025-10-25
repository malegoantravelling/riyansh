'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    let cartSubscription: any

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCartCount(session.user.id)

        // Subscribe to cart changes
        cartSubscription = supabase
          .channel('cart_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'cart_items',
              filter: `user_id=eq.${session.user.id}`,
            },
            () => {
              fetchCartCount(session.user.id)
            }
          )
          .subscribe()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchCartCount(session.user.id)
      } else {
        setCartCount(0)
      }
    })

    return () => {
      subscription.unsubscribe()
      if (cartSubscription) {
        cartSubscription.unsubscribe()
      }
    }
  }, [])

  const fetchCartCount = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', userId)

      if (!error && data) {
        const totalCount = data.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalCount)
      }
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
  }

  return (
    <nav className="bg-white border-b border-[#EEEEEE] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-[#333333]">RIY</span>
              <span className="text-[#8BC34A]">ANSH</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#333333] hover:text-[#8BC34A] transition-colors">
              Home
            </Link>
            <Link href="/store" className="text-[#333333] hover:text-[#8BC34A] transition-colors">
              Store
            </Link>
            <Link href="/about" className="text-[#333333] hover:text-[#8BC34A] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-[#333333] hover:text-[#8BC34A] transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-[#333333] hover:text-[#8BC34A]">
              <Search className="h-5 w-5" />
            </button>

            <Link href="/cart" className="relative text-[#333333] hover:text-[#8BC34A]">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#8BC34A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-[#333333] hover:bg-gray-100 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/account/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/account/addresses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Addresses
                      </Link>
                      <Link
                        href="/account/transactions"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Transactions
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
