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

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  image_url?: string
  quantity: number
  cart_item_id?: string
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
  syncCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'riyansh_cart_v1'

const apiBase = () => {
  const configured =
    process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000'
  if (typeof window === 'undefined') return configured
  try {
    const conf = new URL(configured)
    return `${window.location.protocol}//${window.location.hostname}:${conf.port || '4000'}`
  } catch {
    return configured
  }
}

function mapApiCart(rows: any[]): CartItem[] {
  return (rows || [])
    .filter((row) => row.product)
    .map((row) => ({
      id: row.product_id || row.product.id,
      name: row.product.name,
      slug: row.product.slug,
      price: Number(row.product.price),
      image_url: row.product.image_url,
      quantity: row.quantity,
      cart_item_id: row.id,
    }))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { accessToken, user, loading: authLoading, getAccessToken } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const syncedForUser = useRef<string | null>(null)

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

  const syncCart = useCallback(async () => {
    const token = (await getAccessToken()) || accessToken
    if (!token) return

    const localItems = (() => {
      try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]') as CartItem[]
      } catch {
        return items
      }
    })()

    const payload = {
      items: localItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }

    const postSync = (authToken: string) =>
      fetch(`${apiBase()}/api/cart/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

    let res = await postSync(token)
    if (res.status === 401 || res.status === 403) {
      const refreshed = await getAccessToken()
      if (refreshed && refreshed !== token) {
        res = await postSync(refreshed)
      }
    }

    if (!res.ok) {
      // Keep local cart; auth blips should not crash the page.
      syncedForUser.current = null
      return
    }

    const data = await res.json()
    setItems(mapApiCart(data))
  }, [accessToken, getAccessToken, items])

  useEffect(() => {
    if (!isLoaded || authLoading || !accessToken || !user) {
      if (!user) syncedForUser.current = null
      return
    }
    if (syncedForUser.current === user.id) return
    syncedForUser.current = user.id
    void syncCart()
  }, [accessToken, user, isLoaded, authLoading, syncCart])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const persistRemoteAdd = async (productId: string, quantity: number) => {
    if (!accessToken) return
    try {
      await fetch(`${apiBase()}/api/cart`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity }),
      })
    } catch (err) {
      console.error('Failed to sync add to cart', err)
    }
  }

  const addItem = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    void persistRemoteAdd(product.id, quantity)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId)
      return
    }
    setItems((prev) => {
      const target = prev.find((item) => item.id === productId)
      if (accessToken && target?.cart_item_id) {
        void fetch(`${apiBase()}/api/cart/${target.cart_item_id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        }).catch(console.error)
      }
      return prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === productId)
      if (accessToken && target?.cart_item_id) {
        void fetch(`${apiBase()}/api/cart/${target.cart_item_id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }).catch(console.error)
      } else if (accessToken) {
        // After sync, remove by re-syncing remaining — best effort delete via product id match after refresh
      }
      return prev.filter((item) => item.id !== productId)
    })
  }

  const clearCart = () => {
    setItems([])
    try {
      localStorage.setItem(CART_STORAGE_KEY, '[]')
    } catch {
      // ignore
    }
    if (!accessToken) return
    void fetch(`${apiBase()}/api/cart`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {
      // Backend already clears cart on successful PayU callback; ignore client network blips.
    })
  }

  const refreshCartCount = async () => {
    if (accessToken) {
      await syncCart()
    }
  }

  const incrementCartCount = (_amount: number = 1) => {}

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
        syncCart,
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
