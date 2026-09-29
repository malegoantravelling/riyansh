'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Star, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { useCart } from '@/contexts/CartContext'
import ProductCard from '@/components/ProductCard'
import ProductShare from '@/components/ProductShare'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

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

  const fetchProduct = async (slugOrId: string) => {
    try {
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slugOrId)
        .eq('is_active', true)
        .maybeSingle()

      if (!data) {
        const byId = await supabase
          .from('products')
          .select('*')
          .eq('id', slugOrId)
          .eq('is_active', true)
          .maybeSingle()
        data = byId.data
        error = byId.error
      }

      if (error || !data) {
        throw error || new Error('Product not found')
      }

      setProduct(data)

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
      <div className="container-editorial py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Skeleton className="aspect-square lg:col-span-5" />
          <div className="space-y-4 lg:col-span-7">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-stone/40" />
          <h1 className="font-display text-2xl font-medium text-charcoal">Product Not Found</h1>
          <p className="mt-2 text-sm text-stone">The product you are looking for does not exist.</p>
          <Link href="/store" className="mt-6 inline-block">
            <Button className="rounded-full">Browse Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell surface-band pb-20">
      <div className="border-b border-forest/10 bg-ivory-deep/50">
        <div className="container-editorial py-3">
          <div className="flex items-center gap-2 text-xs text-stone sm:text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-forest">
              Home
            </Link>
            <span>/</span>
            <Link href="/store" className="font-medium transition-colors hover:text-forest">
              Store
            </Link>
            <span>/</span>
            <span className="truncate font-semibold text-charcoal">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container-editorial py-10 lg:py-14">
        <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div
              data-cursor="image"
              className="relative aspect-square overflow-hidden rounded-3xl border border-evergreen/10 bg-white/80 p-8 shadow-soft backdrop-blur-sm"
            >
              {discountPercentage > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white">
                  −{discountPercentage}%
                </span>
              )}
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-contain p-4 transition-transform duration-700 ease-premium hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-24 w-24 text-stone/30" />
                </div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:col-span-7 lg:self-start space-y-5 rounded-3xl border border-evergreen/10 bg-gradient-to-b from-white/90 to-[#f3f4f0]/70 p-6 shadow-soft backdrop-blur-sm sm:p-8">
            <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-charcoal sm:text-4xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < 4 ? 'fill-brass text-brass' : 'fill-stone/20 text-stone/20'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-stone">81 Reviews</span>
            </div>

            <ProductShare
              variant="detail"
              slug={product.slug}
              name={product.name}
              price={product.price}
            />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="font-display text-3xl font-medium text-charcoal">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compare_at_price && (
                <span className="text-base text-stone line-through">
                  ₹{product.compare_at_price.toLocaleString()}
                </span>
              )}
              
            </div>

            <div className="space-y-2 border-y border-forest/10 py-4 text-xs text-charcoal">
              {[
                ['Availability', 'Available'],
                ['Product Type', 'Ayurvedic Medicine / Herbal Healthcare'],
                ['Product Vendor', 'Riyansh Multitrade Pvt. Ltd.'],
                ['Product SKU', 'RY-AMRIT-106'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-32 font-semibold uppercase tracking-wider text-stone">
                    {label}:
                  </span>
                  <span className={label === 'Availability' ? 'font-semibold text-forest' : ''}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center rounded-full border border-forest/20 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-10 items-center justify-center text-charcoal transition-colors hover:bg-forest/5"
                  type="button"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-10 items-center justify-center text-charcoal transition-colors hover:bg-forest/5"
                  type="button"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock_quantity === 0}
                className="h-11 rounded-full px-6"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={product.stock_quantity === 0}
                variant="outline"
                className="h-11 rounded-full px-6"
              >
                Buy Now
              </Button>
            </div>

            <ul className="space-y-1.5 pt-2 text-xs font-medium text-stone">
              <li className="flex items-center gap-2">
                <span className="text-forest">•</span>
                100% Authentic Ayurvedic Herbal Formulation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-forest">•</span>
                Exchange Or Return Within 7 Days Of Delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-forest">•</span>
                Pan-India Express Delivery & Online Support
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-20">
          <div className="mb-6 flex flex-wrap gap-2 border-b border-forest/10 pb-3">
            {[
              ['description', 'Product details'],
              ['reviews', 'Product Reviews'],
              ['shipping', 'Shipping and Returns'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-semibold transition-all',
                  activeTab === id
                    ? 'bg-forest text-white shadow-soft'
                    : 'bg-ivory-deep text-charcoal hover:bg-sage-mist'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-6 text-sm leading-relaxed text-stone">
              <div>
                <h2 className="mb-2 font-display text-lg font-medium uppercase tracking-wide text-charcoal">
                  About this formula
                </h2>
                <p>
                  {product.description ||
                    'Natural Ayurvedic wellness formulation crafted with time-tested organic herbs to promote holistic health, vitality, and natural healing.'}
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal">
                  How to use
                </h3>
                <p>
                  Take 1-2 capsules (or 15-30ml juice) twice daily after meals with lukewarm water
                  or milk, or as directed by an Ayurvedic Physician. Consume regularly for 60 to 90
                  days for optimal results.
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal">
                  Who it is for
                </h3>
                <p>
                  Helps support natural body healing, strengthens immune function, improves
                  vitality, reduces body inflammation, and promotes daily metabolic wellness. Free
                  from artificial chemicals, sugars, and preservatives.
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-charcoal">
                  How it is made
                </h3>
                <p>
                  Formulated under strict GMP certified lab standards by Riyansh Multitrade Pvt.
                  Ltd., combining pure botanical extractions of Ashwagandha, Tulsi, Giloy, Amla, and
                  traditional Rasayana herbs for long-term health and vitality.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-4">
              <h3 className="font-display text-xl font-medium text-charcoal">
                Customer Reviews & Ratings
              </h3>
              {[
                {
                  name: 'Ramesh K.',
                  text: 'Highly effective product! Within 2 weeks of regular use, I noticed remarkable relief and improved energy levels. Very genuine product from Riyansh.',
                },
                {
                  name: 'Sunita M.',
                  text: 'Original 100% Ayurvedic formula. Great packaging and fast delivery. Satisfied with the quality!',
                },
              ].map((review) => (
                <div
                  key={review.name}
                  className="rounded-2xl border border-forest/10 bg-white/70 p-5"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-brass text-brass" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-charcoal">{review.name}</span>
                    <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-forest">
                      Verified Buyer
                    </span>
                  </div>
                  <p className="text-sm text-stone">&quot;{review.text}&quot;</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-3 text-sm text-stone">
              <h3 className="font-display text-lg font-medium text-charcoal">
                Shipping & Delivery Information
              </h3>
              <p>
                • <strong>Express Dispatch:</strong> Orders are processed and shipped within 24
                hours of placement.
              </p>
              <p>
                • <strong>Free Delivery:</strong> Enjoy free express shipping on orders over ₹500
                across all pin codes in India.
              </p>
              <p>
                • <strong>Easy Returns:</strong> 7-day hassle-free return and exchange policy for
                unopened products.
              </p>
              <p>
                • <strong>Customer Support:</strong> Reach out via our online support team for tracking assistance.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-forest/10 pt-12">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-medium tracking-tight text-charcoal sm:text-3xl">
              You may also like
            </h2>
            <p className="mt-2 text-sm text-stone">The herbal choice is a healthy choice.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.length > 0
              ? relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.id} product={relProduct} />
                ))
              : [...Array(4)].map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        </div>
      </div>
    </div>
  )
}
