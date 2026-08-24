'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2, Package, Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWishlist, WishlistItem } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

export default function WishlistPage() {
  const router = useRouter()
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const { user } = useAuth()
  const toast = useToast()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [processingCheckout, setProcessingCheckout] = useState(false)

  const moveToCart = (item: WishlistItem) => {
    addItem(
      {
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        image_url: item.image_url,
      },
      1
    )
    removeFromWishlist(item.id)
  }

  const handleCheckoutSingle = (item: WishlistItem) => {
    setProcessingId(item.id)
    try {
      moveToCart(item)
      if (!user) {
        router.push('/login?next=/checkout')
        return
      }
      router.push('/checkout')
    } catch (error) {
      console.error('Error adding item for checkout:', error)
      toast.error('Error', 'Could not process item. Please try again.')
      setProcessingId(null)
    }
  }

  const handleCheckoutAll = () => {
    if (wishlistItems.length === 0) return

    setProcessingCheckout(true)
    try {
      wishlistItems.forEach((item) => moveToCart(item))
      if (!user) {
        router.push('/login?next=/checkout')
        return
      }
      router.push('/checkout')
    } catch (error) {
      console.error('Error during checkout all:', error)
      toast.error('Error', 'Could not process checkout. Please try again.')
      setProcessingCheckout(false)
    }
  }

  const handleAddToCart = (item: WishlistItem) => {
    moveToCart(item)
    toast.success('Added to cart', `${item.name} moved to your cart.`)
  }

  const subtotal = wishlistItems.reduce((acc, item) => acc + item.price, 0)

  return (
    <div className="page-canvas surface-mist text-evergreen">
      <div className="border-b border-evergreen/10 bg-white/60 py-3 text-center backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-xs sm:text-sm text-gray-600 font-medium">
          <Link href="/" className="hover:text-[#013220] transition-colors">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#013220] font-bold">Wishlist</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#013220] mb-8 sm:mb-12">
          Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="surface-glass mx-auto my-8 max-w-md rounded-2xl p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#013220] mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-6">
              Browse our authentic Ayurvedic products and click the heart icon to save your
              favorites.
            </p>
            <Link href="/store">
              <Button className="bg-[#013220] hover:bg-[#012418] text-white px-6 py-2 text-xs sm:text-sm font-semibold rounded">
                Browse Store
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="surface-glass border-b border-evergreen/10 border-gray-200 text-xs sm:text-sm font-bold text-[#013220]">
                    <th className="py-4 px-6 w-5/12">Product</th>
                    <th className="py-4 px-6 w-2/12">Price</th>
                    <th className="py-4 px-6 w-2/12">Availability</th>
                    <th className="py-4 px-6 w-3/12 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                  {wishlistItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/products/${item.slug}`}
                            className="shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 bg-[#F8F8F6] rounded-md overflow-hidden p-2 flex items-center justify-center border border-gray-100 group"
                          >
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-300" />
                            )}
                          </Link>
                          <div className="space-y-1">
                            <Link
                              href={`/products/${item.slug}`}
                              className="font-bold text-[#013220] hover:text-[#013220] transition-colors leading-snug line-clamp-2 text-sm sm:text-base"
                            >
                              {item.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6 font-bold text-[#013220] text-sm sm:text-base whitespace-nowrap">
                        ₹ {item.price.toLocaleString()}.00
                      </td>
                      <td className="py-6 px-6 font-semibold text-[#013220] text-xs sm:text-sm whitespace-nowrap">
                        Available
                      </td>
                      <td className="py-6 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2.5">
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="bg-white border border-[#013220] text-[#013220] hover:bg-[#f6f0e2] font-semibold text-xs px-3 py-2 rounded"
                          >
                            Add to cart
                          </Button>
                          <Button
                            onClick={() => handleCheckoutSingle(item)}
                            disabled={processingId === item.id}
                            className="bg-[#013220] hover:bg-[#012418] text-white font-semibold text-xs px-4 py-2 rounded transition-all shadow-sm flex items-center gap-1.5"
                          >
                            {processingId === item.id ? (
                              <span>Processing...</span>
                            ) : (
                              <>
                                <ShoppingBag className="h-3.5 w-3.5" />
                                <span>Buy</span>
                              </>
                            )}
                          </Button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-[#E55353] hover:text-red-700 p-2 transition-colors rounded hover:bg-red-50"
                            title="Remove item from wishlist"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="surface-glass rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Wishlist Total ({wishlistItems.length} items)
                </p>
                <p className="text-2xl font-bold text-[#013220]">
                  ₹ {subtotal.toLocaleString()}.00
                </p>
              </div>
              <Button
                onClick={handleCheckoutAll}
                disabled={processingCheckout}
                className="w-full sm:w-auto bg-[#013220] hover:bg-[#012418] text-white font-bold text-sm px-8 py-3 rounded-md shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {processingCheckout ? (
                  <span>Preparing Checkout...</span>
                ) : (
                  <>
                    <span>Move all to cart & checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
