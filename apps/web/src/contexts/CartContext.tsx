'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'

interface CartContextType {
  cartCount: number
  refreshCartCount: () => Promise<void>
  incrementCartCount: (amount?: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize cart count and set up auth listener
    const initializeCart = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUserId(session.user.id)
        await fetchCartCount(session.user.id)
      }
    }

    initializeCart()

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        await fetchCartCount(session.user.id)
      } else {
        setUserId(null)
        setCartCount(0)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    // Set up realtime subscription for cart changes
    const cartSubscription = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Refresh cart count when database changes
          fetchCartCount(userId)
        }
      )
      .subscribe()

    return () => {
      cartSubscription.unsubscribe()
    }
  }, [userId])

  const fetchCartCount = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', uid)

      if (!error && data) {
        const totalCount = data.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalCount)
      }
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  const refreshCartCount = async () => {
    if (userId) {
      await fetchCartCount(userId)
    }
  }

  const incrementCartCount = (amount: number = 1) => {
    setCartCount((prev) => prev + amount)
  }

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, incrementCartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
