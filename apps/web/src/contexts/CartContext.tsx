'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image_url?: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  cartCount: number
  isLoaded: boolean
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  refreshCartCount: () => Promise<void>
  incrementCartCount: (amount?: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'riyansh_cart_v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err)
    }
  }, [items, isLoaded])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const addItem = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    )
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setItems([])
  }

  const refreshCartCount = async () => {
    // No-op for localStorage cart; count is derived from items
  }

  const incrementCartCount = (_amount: number = 1) => {
    // No-op for compatibility; addItem already updates count via items
  }

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        isLoaded,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCartCount,
        incrementCartCount,
      }}
    >
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
