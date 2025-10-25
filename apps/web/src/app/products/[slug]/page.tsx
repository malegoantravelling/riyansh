'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Star,
  CheckCircle2,
  Package,
  Award,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { useCart } from '@/contexts/CartContext'
import ProductCard from '@/components/ProductCard'

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
  category_id?: string
}

export default function ProductDetailsPage() {
  const params = useParams()
  const toast = useToast()
  const { incrementCartCount, refreshCartCount } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  const fetchProduct = async (slug: string) => {
    try {
      console.log('🔍 Fetching product with slug:', slug)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('❌ Error fetching product:', error)

        // Check if product exists but is inactive
        const { data: inactiveProduct } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single()

        if (inactiveProduct) {
          console.warn('⚠️ Product exists but is inactive:', inactiveProduct)
        } else {
          console.error('❌ Product not found with slug:', slug)
        }

        throw error
      }

      console.log('✅ Product found:', data)
      setProduct(data)

      // Fetch related products
      if (data.category_id) {
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', data.category_id)
          .eq('is_active', true)
          .neq('id', data.id)
          .limit(4)

        if (related) {
          setRelatedProducts(related)
        }
      } else {
        // If no category, fetch random products
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .neq('id', data.id)
          .limit(4)

        if (related) {
          setRelatedProducts(related)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast.success(
      isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
      isWishlisted ? 'Item removed from your wishlist' : 'Item added to your wishlist'
    )
  }

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || `Check out ${product.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link Copied!', 'Product link copied to clipboard')
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
        toast.warning('Login Required', 'Please login to add items to cart')
        setAddingToCart(false)
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

      // Immediately update cart count in UI
      incrementCartCount(quantity)

      toast.success('Added to Cart!', `${quantity} x ${product.name} added to your cart`)

      // Refresh from database to ensure accuracy
      await refreshCartCount()
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to Add', 'Could not add product to cart. Please try again.')
      // Refresh cart count on error to ensure accuracy
      await refreshCartCount()
    } finally {
      setAddingToCart(false)
    }
  }

  // Calculate discount percentage
  const discountPercentage = product?.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-32 h-32 border-8 border-[#8BC34A]/20 border-t-[#8BC34A] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-12 h-12 text-[#8BC34A]" />
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-600 animate-pulse">
            Loading product details...
          </p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center max-w-md px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/store">
            <Button size="lg" className="px-8">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Breadcrumb */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-[#8BC34A] transition-colors font-medium"
            >
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href="/store"
              className="text-gray-500 hover:text-[#8BC34A] transition-colors font-medium"
            >
              Store
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#333333] font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-xl group">
              {/* Badges */}
              <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                {product.is_featured && (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Featured
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>

              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="p-8 bg-gray-50 rounded-2xl">
                    <Package className="h-32 w-32 text-gray-300" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#2d2d2d] mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">(4.5) 128 Reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6 p-6 bg-gradient-to-br from-[#8BC34A]/5 to-[#7CB342]/5 rounded-2xl border-2 border-[#8BC34A]/10">
                {product.compare_at_price && (
                  <span className="text-2xl text-gray-400 line-through font-semibold">
                    ₹{product.compare_at_price.toLocaleString()}
                  </span>
                )}
                <span className="text-4xl font-bold text-[#8BC34A]">
                  ₹{product.price.toLocaleString()}
                </span>
                {discountPercentage > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Save {discountPercentage}%
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.description && (
                <p className="text-[#666666] leading-relaxed text-lg">{product.description}</p>
              )}
            </div>

            {/* Stock Status */}
            {product.stock_quantity !== undefined && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-100">
                {product.stock_quantity > 0 ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-600">In Stock</p>
                      <p className="text-sm text-gray-600">
                        {product.stock_quantity} units available
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-500 text-xs font-bold">✗</span>
                    </div>
                    <div>
                      <p className="font-bold text-red-600">Out of Stock</p>
                      <p className="text-sm text-gray-600">Notify when available</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-[#2d2d2d]">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-[#8BC34A] transition-colors">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-14 w-14 rounded-none hover:bg-[#8BC34A]/10"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-14 text-center text-lg font-bold border-0 focus:ring-0 bg-transparent"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-14 w-14 rounded-none hover:bg-[#8BC34A]/10"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
                className="flex-1 h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                size="lg"
              >
                {addingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlist}
                className={`h-14 w-14 sm:w-auto sm:px-6 rounded-xl border-2 transition-all duration-300 ${
                  isWishlisted
                    ? 'bg-pink-50 border-pink-300 hover:bg-pink-100'
                    : 'border-gray-300 hover:border-[#8BC34A] hover:bg-[#8BC34A]/5'
                }`}
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isWishlisted ? 'fill-pink-500 text-pink-500' : ''
                  }`}
                />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="h-14 w-14 sm:w-auto sm:px-6 rounded-xl border-2 border-gray-300 hover:border-[#8BC34A] hover:bg-[#8BC34A]/5 transition-all duration-300"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-[#8BC34A]/10 rounded-lg">
                  <Truck className="h-5 w-5 text-[#8BC34A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2d2d2d]">Free Delivery</p>
                  <p className="text-xs text-gray-500">On orders above ₹500</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-[#8BC34A]/10 rounded-lg">
                  <Shield className="h-5 w-5 text-[#8BC34A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2d2d2d]">100% Genuine</p>
                  <p className="text-xs text-gray-500">Certified products</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                <div className="p-2 bg-[#8BC34A]/10 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-[#8BC34A]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2d2d2d]">Easy Returns</p>
                  <p className="text-xs text-gray-500">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-xl overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-100 bg-gray-50">
              <div className="flex flex-wrap gap-2 p-2">
                {['description', 'specifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white shadow-lg'
                        : 'text-gray-600 hover:bg-white hover:text-[#8BC34A]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-[#2d2d2d] mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {product.description ||
                      'This premium quality product is carefully crafted to meet the highest standards. Made with natural ingredients and backed by our commitment to excellence.'}
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#8BC34A]" />
                      Premium quality ingredients
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#8BC34A]" />
                      Tested for purity and potency
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#8BC34A]" />
                      Manufactured in certified facilities
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-[#8BC34A]" />
                      Safe and effective for daily use
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-2xl font-bold text-[#2d2d2d] mb-6">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Product Type</p>
                      <p className="font-bold text-[#2d2d2d]">Healthcare Supplement</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Form</p>
                      <p className="font-bold text-[#2d2d2d]">Liquid / Capsule</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Storage</p>
                      <p className="font-bold text-[#2d2d2d]">Cool, dry place</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Shelf Life</p>
                      <p className="font-bold text-[#2d2d2d]">24 months</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#2d2d2d] mb-2">You May Also Like</h2>
                <p className="text-gray-600">Explore more similar products</p>
              </div>
              <Link href="/store">
                <Button variant="outline" className="rounded-xl">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <div
                  key={relatedProduct.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Newsletter Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#8BC34A] via-[#7CB342] to-[#689F38] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">Get Exclusive Deals & Updates</h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to our newsletter and get up to <span className="font-bold">55% OFF</span> on
            your first order
          </p>

          <div className="max-w-xl mx-auto">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]/50 text-[#333333]"
                />
                <Button
                  size="lg"
                  className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>No Spam</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>10,000+ Subscribers</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
