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

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Bestseller Ribbon Badge */}
      {isBestseller && (
        <div className="absolute top-0 left-0 z-10">
          <div className="relative">
            {/* Ribbon Shape */}
            <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white text-xs font-bold px-4 py-2 shadow-md">
              Bestseller
            </div>
            {/* Ribbon Fold Effect */}
            <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[8px] border-t-[#689F38]" />
          </div>
        </div>
      )}

      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="p-6 bg-gray-100 rounded-lg">
                <ShoppingCart className="h-16 w-16 text-gray-300" />
              </div>
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="p-5 space-y-3">
          {/* Product Name */}
          <h3 className="font-bold text-lg text-[#2d2d2d] line-clamp-2 min-h-[3.5rem] leading-tight">
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
                  className={`h-4 w-4 ${
                    index < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : index < rating
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-[#2d2d2d]">
              {reviewCount} Review{reviewCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-bold text-[#2d2d2d]">
              ₹ {product.price.toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.compare_at_price.toLocaleString()}
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
            w-full h-12 font-semibold text-base
            transition-all duration-200
            ${
              product.stock_quantity === 0
                ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-[#2d5016] hover:bg-[#3d6022] text-white'
            }
          `}
        >
          {addingToCart ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </div>
          ) : product.stock_quantity === 0 ? (
            'Out of Stock'
          ) : (
            'Add To Cart'
          )}
        </Button>
      </div>
    </div>
  )
}
