'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import ProductShare from '@/components/ProductShare'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { HoverTiltCard } from '@/components/aceternity/hover-tilt-card'
import { SpotlightCard } from '@/components/aceternity/spotlight'

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
  const toast = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const isWishlisted = isInWishlist(product.id)
  const rating = product.rating || 5
  const hasSale = product.compare_at_price && product.price < product.compare_at_price
  const isOutOfStock = product.stock_quantity === 0
  const discount =
    hasSale && product.compare_at_price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0

  const cartProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image_url: product.image_url,
  }

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setAddingToCart(true)
    try {
      addItem(cartProduct, 1)
      toast.success('Added to Cart!', `${product.name} has been added to your cart`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to Add', 'Could not add product to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setBuyingNow(true)
    try {
      addItem(cartProduct, 1)
      if (!user) {
        router.push('/login?next=/checkout')
        return
      }
      router.push('/checkout')
    } catch (error) {
      console.error('Error processing Buy Now:', error)
      toast.error('Error', 'Could not process Buy Now. Please try again.')
      setBuyingNow(false)
    }
  }

  return (
    <HoverTiltCard>
    <SpotlightCard
      data-cursor="product"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-evergreen/8 bg-white p-4 shadow-soft transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-evergreen/20"
    >
      <div className="relative z-20 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleWishlist}
            type="button"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm transition-colors',
              isWishlisted
                ? 'border-evergreen bg-evergreen/10 text-evergreen'
                : 'border-evergreen/15 text-evergreen hover:border-evergreen'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-4 w-4 transition-transform', isWishlisted && 'fill-current scale-110')} />
          </button>
          <ProductShare
            variant="icon"
            slug={product.slug}
            name={product.name}
            price={product.price}
          />
        </div>

        {hasSale ? (
          <span className="rounded-full bg-evergreen px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            {discount > 0 ? `−${discount}%` : 'Sale'}
          </span>
        ) : null}
      </div>

      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col items-center">
        <div
          data-cursor="image"
          className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-cotton-deep"
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 transition-transform duration-700 ease-premium group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-dusty-olive/40" />
            </div>
          )}
        </div>

        <h3 className="mb-2 min-h-[2.5rem] px-1 text-center font-display text-base font-medium leading-snug text-evergreen transition-colors group-hover:text-evergreen-mid line-clamp-2 sm:text-lg">
          {product.name}
        </h3>

        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-evergreen">
            ₹{product.price.toLocaleString()}
          </span>
          {product.compare_at_price && (
            <span className="text-sm text-dusty-olive line-through">
              ₹{product.compare_at_price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="mb-4 flex items-center justify-center gap-0.5">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={cn(
                'h-3.5 w-3.5',
                index < Math.floor(rating)
                  ? 'fill-dusty-olive text-dusty-olive'
                  : 'fill-dusty-olive/20 text-dusty-olive/20'
              )}
            />
          ))}
        </div>
      </Link>

      <div className="mt-auto flex gap-2 pt-1">
        <Button
          onClick={handleAddToCart}
          disabled={addingToCart || isOutOfStock}
          variant="outline"
          className={cn(
            'h-10 flex-1 rounded-full text-xs sm:text-sm',
            isOutOfStock &&
              'cursor-not-allowed border-dusty-olive/20 text-dusty-olive hover:bg-transparent hover:text-dusty-olive'
          )}
        >
          {addingToCart ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>

        {!isOutOfStock && (
          <Button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className="h-10 flex-1 rounded-full text-xs sm:text-sm"
          >
            {buyingNow ? 'Buying...' : 'Buy Now'}
          </Button>
        )}
      </div>
    </SpotlightCard>
    </HoverTiltCard>
  )
}
