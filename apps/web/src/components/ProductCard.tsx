'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Eye, Sparkles, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addingToCart, setAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Calculate discount percentage
  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  // Check if product is new (created within last 30 days)
  const isNew = product.created_at
    ? new Date().getTime() - new Date(product.created_at).getTime() < 30 * 24 * 60 * 60 * 1000
    : false

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setAddingToCart(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        alert('Please login to add items to cart')
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

      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist functionality
  }

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#8BC34A]/40 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-bl-full z-0" />

      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {discountPercentage > 0 && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-75" />
            <span className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-white" />
              {discountPercentage}% OFF
            </span>
          </div>
        )}
        {isNew && (
          <span className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            New Arrival
          </span>
        )}
        {product.is_featured && (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-1.5">
            <Star className="h-3 w-3 fill-white" />
            Featured
          </span>
        )}
      </div>

      {/* Quick Actions Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
        <button
          onClick={handleWishlist}
          className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:bg-[#8BC34A] hover:scale-110 transition-all duration-300 group/heart"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-300 ${
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-700 group-hover/heart:text-white'
            }`}
          />
        </button>
        <Link
          href={`/products/${product.slug}`}
          className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:bg-[#8BC34A] hover:scale-110 transition-all duration-300 group/eye"
        >
          <Eye className="h-4 w-4 text-gray-700 group-hover/eye:text-white transition-colors duration-300" />
        </Link>
      </div>

      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,195,74,0.1),transparent_50%)]" />
          </div>

          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-8 group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="p-8 bg-gray-100 rounded-2xl">
                <ShoppingCart className="h-20 w-20 text-gray-300" />
              </div>
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#8BC34A]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-6 space-y-3">
          {/* Product Name */}
          <h3 className="font-bold text-lg text-[#2d2d2d] mb-2 line-clamp-2 group-hover:text-[#8BC34A] transition-colors duration-300 min-h-[3.5rem] leading-tight">
            {product.name}
          </h3>

          {/* Stock Status with Enhanced Design */}
          {product.stock_quantity !== undefined && (
            <div className="flex items-center gap-2">
              {product.stock_quantity > 0 ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-green-700 font-semibold">
                    {product.stock_quantity < 10
                      ? `Only ${product.stock_quantity} left!`
                      : 'In Stock'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="text-xs text-red-700 font-semibold">Out of Stock</span>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Pricing Section */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-extrabold text-[#8BC34A] tracking-tight">
              ₹{product.price.toLocaleString()}
            </span>
            {product.compare_at_price && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.compare_at_price.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  Save ₹{(product.compare_at_price - product.price).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Stock Progress Indicator */}
          {product.stock_quantity !== undefined &&
            product.stock_quantity > 0 &&
            product.stock_quantity < 20 && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600 font-medium">Stock Level</span>
                  <span className="text-xs text-[#8BC34A] font-bold">
                    {product.stock_quantity} units
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-full shadow-sm transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min((product.stock_quantity / 20) * 100, 100)}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />
                  </div>
                </div>
              </div>
            )}
        </div>
      </Link>

      {/* Enhanced Add to Cart Button */}
      <div className="px-6 pb-6">
        <Button
          onClick={handleAddToCart}
          disabled={addingToCart || product.stock_quantity === 0}
          className={`
            w-full h-12 relative overflow-hidden font-bold text-base
            transition-all duration-300 rounded-xl
            ${
              product.stock_quantity === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] shadow-lg hover:shadow-xl'
            }
            transform hover:scale-[1.02] active:scale-[0.98]
          `}
        >
          <span className="relative z-10 flex items-center justify-center gap-2.5">
            {!addingToCart && product.stock_quantity !== 0 && (
              <ShoppingCart className="h-5 w-5 group-hover:animate-bounce" />
            )}
            {addingToCart && (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span className="font-bold tracking-wide">
              {addingToCart
                ? 'Adding to Cart...'
                : product.stock_quantity === 0
                ? 'Out of Stock'
                : 'Add to Cart'}
            </span>
          </span>

          {/* Animated Background Gradient */}
          {product.stock_quantity !== 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#7CB342] via-[#8BC34A] to-[#7CB342] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient" />
          )}
        </Button>
      </div>

      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8BC34A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}
