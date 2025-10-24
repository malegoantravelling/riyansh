'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price?: number
    image_url?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [addingToCart, setAddingToCart] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking add to cart
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

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('product_id', product.id)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        // Add new item
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

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-[#EEEEEE] hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-gray-100">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-contain p-4" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-4 text-center">
          <h3 className="font-medium text-[#333333] mb-2 group-hover:text-[#8BC34A] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-center space-x-2 mb-3">
            {product.compare_at_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.compare_at_price}
              </span>
            )}
            <span className="text-lg font-semibold text-[#8BC34A]">₹{product.price}</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button onClick={handleAddToCart} disabled={addingToCart} className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
