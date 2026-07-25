'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import ProductShare from '@/components/ProductShare'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number
    image_url?: string
    is_featured?: boolean
    created_at?: string
    stock_quantity?: number
    description?: string
    rating?: number
    review_count?: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addingToCart, setAddingToCart] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)
  const router = useRouter()
  const toast = useToast()
  const { incrementCartCount, refreshCartCount } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const isWishlisted = isInWishlist(product.id)
  const rating = product.rating || 5
  const hasSale = product.compare_at_price && product.price < product.compare_at_price
  const isOutOfStock = product.stock_quantity === 0

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compare_at_price: product.compare_at_price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
    })

    if (!isWishlisted) {
      toast.success('Added to Wishlist', `${product.name} saved to your wishlist.`)
    } else {
      toast.info('Removed from Wishlist', `${product.name} removed from your wishlist.`)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setAddingToCart(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        toast.warning('Login Required', 'Please login to add items to cart')
        localStorage.setItem(
          'redirect_after_login',
          window.location.pathname || '/store'
        )
        router.push('/auth/login')
        setAddingToCart(false)
        return
      }

      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('product_id', product.id)
        .single()

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('cart_items').insert({
          user_id: session.user.id,
          product_id: product.id,
          quantity: 1,
        })

        if (error) throw error
      }

      incrementCartCount(1)
      toast.success('Added to Cart!', `${product.name} has been added to your cart`)
      await refreshCartCount()
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to Add', 'Could not add product to cart. Please try again.')
      await refreshCartCount()
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setBuyingNow(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        toast.warning('Login Required', 'Please login to proceed with Buy Now')
        localStorage.setItem(
          'redirect_after_login',
          window.location.pathname || '/store'
        )
        router.push('/auth/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', session.user.id)
        .single()

      const { data: defaultAddress } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_default', true)
        .single()

      const userName = userProfile?.full_name || 'Customer'
      const userEmail = userProfile?.email || session.user.email || 'N/A'
      const userPhone = defaultAddress?.phone || 'N/A'
      const address = defaultAddress
        ? `${defaultAddress.address_line_1}, ${defaultAddress.city}, ${defaultAddress.state}, ${defaultAddress.zip_code}`
        : 'N/A'

      const whatsappMessage = `Hello Riyansh Amrit! I want to order ${product.name}.

Customer Details:
Name: ${userName}
Email: ${userEmail}
Phone: ${userPhone}
Address: ${address}

Order Details:
1. ${product.name}
   Qty: 1 × ₹${product.price.toLocaleString()} = ₹${product.price.toLocaleString()}

Total Amount: ₹${product.price.toLocaleString()}`

      const encodedMessage = encodeURIComponent(whatsappMessage)
      const whatsappUrl = `https://wa.me/918605911293?text=${encodedMessage}`
      window.location.href = whatsappUrl
    } catch (error) {
      console.error('Error processing Buy Now:', error)
      toast.error('Error', 'Could not process Buy Now. Please try again.')
    } finally {
      setBuyingNow(false)
    }
  }

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-[#5B8C51] hover:shadow-xl transition-all duration-300 flex flex-col p-4">
      {/* Top Header Icons (Wishlist, Share & Sale Badge) */}
      <div className="flex items-center justify-between z-20 mb-2 relative">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleWishlist}
            type="button"
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#5B8C51] transition-colors bg-white shadow-sm"
            aria-label="Add to Wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted
                  ? 'fill-[#5B8C51] text-[#5B8C51]'
                  : 'text-[#5B8C51] hover:fill-[#5B8C51]/20'
              }`}
            />
          </button>
          <ProductShare
            variant="icon"
            slug={product.slug}
            name={product.name}
            price={product.price}
          />
        </div>

        {hasSale ? (
          <span className="bg-[#5B8C51] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[3px] uppercase tracking-wide shadow-sm">
            Sale!
          </span>
        ) : null}
      </div>

      <Link href={`/products/${product.slug}`} className="block flex-1 flex flex-col items-center">
        {/* Product Image Area */}
        <div className="relative w-full aspect-square bg-white flex items-center justify-center p-3 mb-3">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
            </div>
          )}
        </div>

        {/* Product Name (Centered) */}
        <h3 className="font-bold text-sm sm:text-base text-[#1A1A1A] text-center line-clamp-2 min-h-[2.5rem] leading-snug mb-2 group-hover:text-[#5B8C51] transition-colors px-1">
          {product.name}
        </h3>

        {/* Price Section (Centered) */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-base sm:text-lg font-bold text-[#1A1A1A]">
            ₹{product.price.toLocaleString()}
          </span>
          {product.compare_at_price && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{product.compare_at_price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating Stars (Centered) */}
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-3.5 w-3.5 ${
                index < Math.floor(rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          ))}
        </div>
      </Link>

      {/* Action Buttons: Add to Cart + Buy Now */}
      <div className="mt-auto pt-1 flex gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={addingToCart || isOutOfStock}
          variant="outline"
          className={`
            flex-1 h-10 text-xs sm:text-sm font-semibold rounded-md
            border border-[#5B8C51] text-[#5B8C51] bg-white
            hover:bg-[#5B8C51] hover:text-white
            transition-all duration-300 flex items-center justify-center gap-1 shadow-sm px-2
            ${
              isOutOfStock
                ? 'border-gray-200 text-gray-400 bg-gray-100 hover:bg-gray-100 hover:text-gray-400 cursor-not-allowed'
                : ''
            }
          `}
        >
          {addingToCart ? (
            <div className="flex items-center gap-1">
              <div className="h-3.5 w-3.5 border-2 border-[#5B8C51] border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </div>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <span>Add to Cart</span>
              <span className="text-base leading-none">→</span>
            </>
          )}
        </Button>

        {!isOutOfStock && (
          <Button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className="flex-1 h-10 text-xs sm:text-sm font-semibold rounded-md
              bg-[#5B8C51] text-white hover:bg-[#4E7A45]
              transition-all duration-300 flex items-center justify-center gap-1 shadow-sm px-2"
          >
            {buyingNow ? (
              <div className="flex items-center gap-1">
                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Buying...</span>
              </div>
            ) : (
              <>
                <span>Buy Now</span>
                <span className="text-base leading-none">→</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
