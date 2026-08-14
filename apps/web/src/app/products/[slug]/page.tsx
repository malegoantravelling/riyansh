'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Star,
  Package,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { useCart } from '@/contexts/CartContext'
import ProductCard from '@/components/ProductCard'
import ProductShare from '@/components/ProductShare'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

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
  const router = useRouter()
  const toast = useToast()
  const { user } = useAuth()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
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

      if (error) {
        throw error
      }

      setProduct(data)

      // Fetch related products
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', data.id)
        .limit(4)

      if (related) {
        setRelatedProducts(related)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = () => {
    if (!product) return

    try {
      addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image_url: product.image_url,
        },
        quantity
      )
      if (!user) {
        router.push('/login?next=/checkout')
        return
      }
      router.push('/checkout')
    } catch (error) {
      console.error('Error processing Buy Now:', error)
      toast.error('Error', 'Could not process Buy Now. Please try again.')
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    setAddingToCart(true)
    try {
      addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image_url: product.image_url,
        },
        quantity
      )
      toast.success('Added to Cart!', `${quantity} x ${product.name} added to your cart`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to Add', 'Could not add product to cart. Please try again.')
    } finally {
      setAddingToCart(false)
    }
  }

  const discountPercentage = product?.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5B8C51]/20 border-t-[#5B8C51] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">The product you are looking for does not exist.</p>
          <Link href="/store">
            <Button className="bg-[#5B8C51] text-white hover:bg-[#4E7A45]">Browse Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#FAF9F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-[#5B8C51] transition-colors font-medium">
              Home
            </Link>
            <span>/</span>
            <Link href="/store" className="hover:text-[#5B8C51] transition-colors font-medium">
              Store
            </Link>
            <span>/</span>
            <span className="text-[#1A1A1A] font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Top Main Product Showcase (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Left Column: Product Image Box */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-square bg-[#F8F8F6] rounded-xl overflow-hidden p-8 flex items-center justify-center border border-gray-100">
              {discountPercentage > 0 && (
                <span className="absolute top-4 right-4 z-10 bg-[#5B8C51] text-white text-xs font-semibold px-2.5 py-1 rounded">
                  Sale!
                </span>
              )}
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <Package className="h-24 w-24 text-gray-300" />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Ratings, Price, Meta, Actions */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] leading-tight">
              {product.name}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">81 Reviews</span>
            </div>

            {/* Copy link & Share */}
            <ProductShare
              variant="detail"
              slug={product.slug}
              name={product.name}
              price={product.price}
            />

            {/* Price & Bundle Row */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-3xl font-bold text-[#1A1A1A]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compare_at_price && (
                <span className="text-base text-gray-400 line-through">
                  ₹{product.compare_at_price.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-gray-500 font-medium">Bundle</span>
              <span className="bg-[#5B8C51] text-white text-xs font-semibold px-2.5 py-1 rounded">
                60 Capsules
              </span>
            </div>

            {/* Product Meta List */}
            <div className="border-t border-b border-gray-200 py-3 my-2 space-y-1.5 text-xs text-[#333333]">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-gray-700 w-32">
                  AVAILABILITY:
                </span>
                <span className="text-[#5B8C51] font-semibold">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-gray-700 w-32">
                  PRODUCT TYPE:
                </span>
                <span className="text-gray-600">Ayurvedic Medicine / Herbal Healthcare</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-gray-700 w-32">
                  PRODUCT VENDOR:
                </span>
                <span className="text-gray-600">Riyansh Multitrade Pvt. Ltd.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-gray-700 w-32">
                  PRODUCT SKU:
                </span>
                <span className="text-gray-600">RY-AMRIT-106</span>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* Quantity Selector */}
              <div className="inline-flex items-center border border-gray-300 rounded-md bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#1A1A1A]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-base"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
                className="bg-[#5B8C51] hover:bg-[#4E7A45] text-white font-semibold px-6 h-10 rounded-md text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
              >
                {addingToCart ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <span>Add to Cart</span>
                    <span className="text-base">→</span>
                  </>
                )}
              </Button>

              {/* Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                variant="outline"
                className="border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white font-semibold px-6 h-10 rounded-md text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <span>Buy Now</span>
                <span className="text-base">→</span>
              </Button>
            </div>

            {/* Bullet Highlights */}
            <ul className="space-y-1 text-xs text-gray-700 pt-2 font-medium">
              <li className="flex items-center gap-2">
                <span className="text-[#5B8C51] font-bold">•</span>
                <span>100% Authentic Ayurvedic Herbal Formulation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#5B8C51] font-bold">•</span>
                <span>Exchange Or Return Within 7 Days Of Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#5B8C51] font-bold">•</span>
                <span>For Shipping Support Contact: +91 8605911293</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Middle Section: Tabbed Content (Product Details / Reviews / Shipping) */}
        <div className="mb-20">
          {/* Tab Controls */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'description'
                  ? 'bg-[#5B8C51] text-white shadow-sm'
                  : 'bg-[#F4F4F0] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Product details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#5B8C51] text-white shadow-sm'
                  : 'bg-[#F4F4F0] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Product Reviews
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-3 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'shipping'
                  ? 'bg-[#5B8C51] text-white shadow-sm'
                  : 'bg-[#F4F4F0] text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shipping and Returns
            </button>
          </div>

          {/* Tab 1: Product details */}
          {activeTab === 'description' && (
            <div className="bg-white space-y-6 text-sm text-gray-700 leading-relaxed max-w-5xl">
              <div>
                <h2 className="font-bold text-base text-[#1A1A1A] mb-2">
                  About this formula
                </h2>
                <p>{product.description || 'Natural Ayurvedic wellness formulation crafted with time-tested organic herbs to promote holistic health, vitality, and natural healing.'}</p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">
                  How to use
                </h3>
                <p>
                  Take 1-2 capsules (or 15-30ml juice) twice daily after meals with lukewarm water or milk, or as directed by an Ayurvedic Physician. Consume regularly for 60 to 90 days for optimal results.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">
                  Who it is for
                </h3>
                <p>
                  Helps support natural body healing, strengthens immune function, improves vitality, reduces body inflammation, and promotes daily metabolic wellness. Free from artificial chemicals, sugars, and preservatives.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">
                  How it is made
                </h3>
                <p>
                  Formulated under strict GMP certified lab standards by Riyansh Multitrade Pvt. Ltd., combining pure botanical extractions of Ashwagandha, Tulsi, Giloy, Amla, and traditional Rasayana herbs for long-term health and vitality.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Reviews */}
          {activeTab === 'reviews' && (
            <div className="bg-white space-y-4 max-w-4xl">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Customer Reviews & Ratings</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-[#1A1A1A]">Ramesh K.</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">Verified Buyer</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    &quot;Highly effective product! Within 2 weeks of regular use, I noticed remarkable relief and improved energy levels. Very genuine product from Riyansh.&quot;
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-[#1A1A1A]">Sunita M.</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">Verified Buyer</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    &quot;Original 100% Ayurvedic formula. Great packaging and fast delivery. Satisfied with the quality!&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Shipping */}
          {activeTab === 'shipping' && (
            <div className="bg-white space-y-3 text-xs sm:text-sm text-gray-700 max-w-4xl">
              <h3 className="font-bold text-base text-[#1A1A1A]">Shipping & Delivery Information</h3>
              <p>• <strong>Express Dispatch:</strong> Orders are processed and shipped within 24 hours of placement.</p>
              <p>• <strong>Free Delivery:</strong> Enjoy free express shipping on orders over ₹500 across all pin codes in India.</p>
              <p>• <strong>Easy Returns:</strong> 7-day hassle-free return and exchange policy for unopened products.</p>
              <p>• <strong>Customer Support:</strong> Call +91 8605911293 for tracking assistance.</p>
            </div>
          )}
        </div>

        {/* Bottom Section: RELATED PRODUCTS */}
        <div className="pt-8 border-t border-gray-200">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
              You may also like
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              The herbal choice is a healthy choice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0
              ? relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))
              : [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
