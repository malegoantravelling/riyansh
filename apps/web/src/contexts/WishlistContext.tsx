'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { resolveApiBase } from '@/lib/apiBase'

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

function mapApiWishlist(rows: any[]): WishlistItem[] {
  return (rows || [])
    .filter((row) => row.product)
    .map((row) => ({
      id: row.product_id || row.product.id,
      name: row.product.name,
      slug: row.product.slug,
      price: Number(row.product.price),
      compare_at_price: row.product.compare_at_price
        ? Number(row.product.compare_at_price)
        : undefined,
      image_url: row.product.image_url,
      stock_quantity: row.product.stock_quantity,
    }))
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { accessToken, user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const syncedForUser = useRef<string | null>(null)

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

  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems))
    } catch (err) {
      console.error('Failed to save wishlist to localStorage:', err)
    }
  }, [wishlistItems, isLoaded])

  const syncWishlist = useCallback(async () => {
    if (!accessToken) return
    const localIds = (() => {
      try {
        const stored = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY) || '[]') as WishlistItem[]
        return stored.map((i) => i.id)
      } catch {
        return wishlistItems.map((i) => i.id)
      }
    })()

    try {
      const res = await fetch(`${resolveApiBase()}/api/wishlist/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_ids: localIds }),
      })

      if (!res.ok) {
        syncedForUser.current = null
        return
      }
      const data = await res.json()
      setWishlistItems(mapApiWishlist(data))
    } catch {
      syncedForUser.current = null
    }
  }, [accessToken, wishlistItems])

  useEffect(() => {
    if (!isLoaded || !accessToken || !user) {
      if (!user) syncedForUser.current = null
      return
    }
    if (syncedForUser.current === user.id) return
    syncedForUser.current = user.id
    void syncWishlist()
  }, [accessToken, user, isLoaded, syncWishlist])

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.id === productId)
  }

  const toggleWishlist = (product: WishlistItem) => {
    const exists = wishlistItems.some((item) => item.id === product.id)
    setWishlistItems((prev) => {
      if (exists) {
        return prev.filter((item) => item.id !== product.id)
      }
      return [...prev, product]
    })

    if (accessToken) {
      if (exists) {
        void fetch(`${resolveApiBase()}/api/wishlist/${product.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => {})
      } else {
        void fetch(`${resolveApiBase()}/api/wishlist`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: product.id }),
        }).catch(() => {})
      }
    }
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
    if (accessToken) {
      void fetch(`${resolveApiBase()}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch(() => {})
    }
  }

  const clearWishlist = () => {
    const ids = wishlistItems.map((i) => i.id)
    setWishlistItems([])
    if (accessToken) {
      ids.forEach((id) => {
        void fetch(`${resolveApiBase()}/api/wishlist/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(() => {})
      })
    }
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
