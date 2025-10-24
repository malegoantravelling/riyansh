'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  image_url?: string
  images?: string[]
  stock_quantity?: number
  is_featured: boolean
  is_active: boolean
}

export default function ProductDetailsPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

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
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        // Add new item
        const { error } = await supabase.from('cart_items').insert({
          user_id: session.user.id,
          product_id: product.id,
          quantity: quantity,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8BC34A]"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/store">
            <Button>Back to Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-[#666666]">
            <Link href="/" className="hover:text-[#8BC34A]">
              Home
            </Link>
            <span>/</span>
            <Link href="/store" className="hover:text-[#8BC34A]">
              Store
            </Link>
            <span>/</span>
            <span className="text-[#333333]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ShoppingCart className="h-24 w-24" />
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#333333] mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-6">
                {product.compare_at_price && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.compare_at_price}
                  </span>
                )}
                <span className="text-2xl font-bold text-[#8BC34A]">₹{product.price}</span>
              </div>

              {product.description && (
                <p className="text-[#666666] leading-relaxed mb-6">{product.description}</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-0 focus:ring-0"
                  min="1"
                />
                <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addingToCart ? 'Adding to Cart...' : 'ADD TO CART'}
              </Button>

              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Stock Status */}
            {product.stock_quantity !== undefined && (
              <div className="text-sm">
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600">
                    ✓ In Stock ({product.stock_quantity} available)
                  </span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-[#8BC34A] text-[#8BC34A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ordering Information
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'specifications'
                    ? 'border-[#8BC34A] text-[#8BC34A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Specifications
              </button>
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">
                        Material
                      </td>
                      <td className="border border-gray-300 px-4 py-2">Description</td>
                      <td className="border border-gray-300 px-4 py-2">Packaging</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">OTC022401</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Pain Management: Acetaminophen PM Extra-Strength Caplets, 500 mg, 100/Bottle
                      </td>
                      <td className="border border-gray-300 px-4 py-2">1 BT</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">OTC022401</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Pain Management: Acetaminophen PM Extra-Strength Caplets, 500 mg, 100/Bottle
                      </td>
                      <td className="border border-gray-300 px-4 py-2">144/CS</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">OTC022401</td>
                      <td className="border border-gray-300 px-4 py-2">
                        Pain Management: Acetaminophen PM Extra-Strength Caplets, 500 mg, 100/Bottle
                      </td>
                      <td className="border border-gray-300 px-4 py-2">1 EA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <ul className="space-y-2">
                  <li>
                    <strong>Product Name:</strong> {product.name}
                  </li>
                  <li>
                    <strong>Price:</strong> ₹{product.price}
                  </li>
                  {product.stock_quantity && (
                    <li>
                      <strong>Stock:</strong> {product.stock_quantity} units
                    </li>
                  )}
                  <li>
                    <strong>Category:</strong> Ayurvedic Medicine
                  </li>
                  <li>
                    <strong>Brand:</strong> Riyansh
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#8BC34A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Sign up for discount up to 55% OFF</h2>
          <p className="text-white/90 mb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo omnis voluptatem
            consectetur quam.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-md focus:outline-none"
            />
            <Button className="bg-white text-[#8BC34A] hover:bg-gray-100 rounded-l-none px-8">
              SIGN UP
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
