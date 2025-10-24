'use client'

import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import { Package, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

const testimonials = [
  {
    id: 1,
    name: 'Elizabeth Graham',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero omnis, vitae sequi culpa libero, mollitia vel quasi consequuntur a impedit accusamus qui sit voluptatem.',
    avatar: 'https://via.placeholder.com/80x80?text=EG',
  },
  {
    id: 2,
    name: 'Jennifer Greive',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero omnis, vitae sequi culpa libero, mollitia vel quasi consequuntur a impedit accusamus qui sit voluptatem.',
    avatar: 'https://via.placeholder.com/80x80?text=JG',
  },
]

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/api/products')
        const productsArray = Array.isArray(data) ? data : []
        // Show first 4 products as featured products
        setFeaturedProducts(productsArray.slice(0, 4))
      } catch (error) {
        console.error('Error fetching products:', error)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-gray-100 to-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://via.placeholder.com/1920x600?text=Hero+Background)',
          }}
        >
          <div className="absolute inset-0 bg-white/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-[#333333] mb-4">
              New Medicine <span className="text-[#8BC34A]">Everyday</span>
            </h1>
            <p className="text-lg text-[#666666] mb-8">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex perspiciatis non
              quibusdam vel quidem.
            </p>
            <Link href="/store">
              <Button size="lg" className="text-lg px-8">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A5D6A7] rounded-full mb-4">
                <Package className="h-8 w-8 text-[#8BC34A]" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Free Delivery</h3>
              <p className="text-[#666666]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at iaculis quam.
              </p>
              <button className="mt-4 text-[#8BC34A] hover:underline">Learn more →</button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A5D6A7] rounded-full mb-4">
                <Shield className="h-8 w-8 text-[#8BC34A]" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">New Medicine everyday</h3>
              <p className="text-[#666666]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at iaculis quam.
              </p>
              <button className="mt-4 text-[#8BC34A] hover:underline">Learn more →</button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A5D6A7] rounded-full mb-4">
                <Clock className="h-8 w-8 text-[#8BC34A]" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">Packing Guaranteed</h3>
              <p className="text-[#666666]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at iaculis quam.
              </p>
              <button className="mt-4 text-[#8BC34A] hover:underline">Learn more →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-[#A5D6A7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333]">
              Pharmacy <span className="text-[#8BC34A]">Products</span>
            </h2>
            <div className="w-20 h-1 bg-[#8BC34A] mx-auto mt-4" />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#666666]">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/store">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#8BC34A]">
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

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333]">
              Happy <span className="text-[#8BC34A]">Customers</span>
            </h2>
            <div className="w-20 h-1 bg-[#8BC34A] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gray-50 rounded-lg p-8 border border-[#EEEEEE]"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden mr-4">
                    <Image src={testimonial.avatar} alt={testimonial.name} width={64} height={64} />
                  </div>
                  <h4 className="font-semibold text-[#333333]">{testimonial.name}</h4>
                </div>
                <p className="text-[#666666] italic">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 bg-[#A5D6A7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#333333]">
              Why <span className="text-[#8BC34A]">Us</span>
            </h2>
            <div className="w-20 h-1 bg-[#8BC34A] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#8BC34A] text-white rounded-full flex items-center justify-center font-bold">
                  {item}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#333333] mb-2">
                    Lorem ipsum dolor sit amet consectetur
                  </h3>
                  <p className="text-[#666666]">
                    adipisicing elit. Vero omnis, vitae sequi culpa libero ullam voluptates earum
                    iusto
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
