'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'

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
  const toast = useToast()

  // Default values for rating and reviews
  const rating = product.rating || 4.5
  const reviewCount = product.review_count || Math.floor(Math.random() * 300) + 50
  const description = product.description || 'Premium quality product | Natural ingredients'

  // Check if product is bestseller (featured or has high reviews)
  const isBestseller = product.is_featured || reviewCount > 200

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

      toast.success('Added to Cart!', `${product.name} has been added to your cart`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to Add', 'Could not add product to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  // Calculate discount percentage
  const discountPercentage =
    product.compare_at_price && product.price < product.compare_at_price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#8BC34A]/30 hover:-translate-y-2">
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {isBestseller && (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Star className="h-3 w-3 fill-white" />
            Bestseller
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {discountPercentage}% OFF
          </span>
        )}
        {product.stock_quantity && product.stock_quantity < 10 && product.stock_quantity > 0 && (
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            Only {product.stock_quantity} left!
          </span>
        )}
      </div>

      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="p-6 bg-white rounded-2xl shadow-lg">
                <ShoppingCart className="h-16 w-16 text-gray-300" />
              </div>
            </div>
          )}

          {/* Quick View Button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <span className="px-6 py-2 bg-white/95 backdrop-blur-sm text-[#8BC34A] text-xs font-bold rounded-full shadow-xl hover:bg-[#8BC34A] hover:text-white transition-colors whitespace-nowrap">
              Quick View
            </span>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-5 space-y-3">
          {/* Product Name */}
          <h3 className="font-bold text-lg text-[#2d2d2d] line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-[#8BC34A] transition-colors">
            {product.name}
          </h3>

          {/* Product Description/Benefits */}
          <p className="text-sm text-[#666666] line-clamp-1 min-h-[1.25rem]">{description}</p>

          {/* Star Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 transition-all ${
                    index < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : index < rating
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#666666] font-medium">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-2xl font-bold text-[#2d2d2d] group-hover:text-[#8BC34A] transition-colors">
              ₹{product.price.toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.compare_at_price.toLocaleString()}
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="ml-auto bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                Save {discountPercentage}%
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Button */}
      <div className="px-5 pb-5">
        <Button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock_quantity === 0}
          className={`
            w-full h-12 font-bold text-sm rounded-xl
            transition-all duration-300 shadow-lg
            ${
              product.stock_quantity === 0
                ? 'bg-gray-200 cursor-not-allowed text-gray-500 shadow-none'
                : 'bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white hover:shadow-xl hover:scale-105'
            }
          `}
        >
          {addingToCart ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </div>
          ) : product.stock_quantity === 0 ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Out of Stock
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add To Cart
            </div>
          )}
        </Button>
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </div>
  )
}
