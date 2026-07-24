'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price?: number
  image_url?: string
  stock_quantity?: number
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  wishlistCount: number
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: WishlistItem) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = 'riyansh_wishlist_v1'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
      if (stored) {
        setWishlistItems(JSON.parse(stored))
      }
    } catch (err) {
      console.error('Failed to load wishlist from localStorage:', err)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Sync with localStorage on changes
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems))
    } catch (err) {
      console.error('Failed to save wishlist to localStorage:', err)
    }
  }, [wishlistItems, isLoaded])

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const toggleWishlist = (product: WishlistItem) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id)
      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      } else {
        return [...prev, product]
      }
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
