'use client'

import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'
import { Package, Shield, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    text: "Excellent service and genuine products! I have been ordering my mother's diabetes medicines from Riyansh for the past 6 months. The medicines are always authentic, well-packaged, and delivered on time. The customer support team is very helpful and knowledgeable.",
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    text: 'Best online pharmacy in India! Their Ayurvedic products are of premium quality and 100% genuine. I ordered Amrit juice and tablets for my family, and we can see real health benefits. Fast delivery and great customer service. Highly recommended!',
    avatar:
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
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
        // Show first 8 products as featured products
        setFeaturedProducts(productsArray.slice(0, 8))
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
      {/* Enhanced Hero Section */}
      <section className="relative h-[700px] bg-gradient-to-br from-[#f8fdf9] via-white to-[#A5D6A7]/5 overflow-hidden">
        {/* Background with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/image/hero_bg_2.jpg)',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/70" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#8BC34A]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#8BC34A]/5 rounded-full blur-2xl" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl space-y-6 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BC34A]/10 rounded-full border border-[#8BC34A]/20">
              <span className="w-2 h-2 bg-[#8BC34A] rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-[#8BC34A]">
                Trusted Healthcare Partner
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-[#333333] leading-tight">
              Your Health,{' '}
              <span className="text-[#8BC34A] relative inline-block">
                Our Priority
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 5 150 5 298 10"
                    stroke="#8BC34A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-[#666666] leading-relaxed">
              Discover premium quality medicines and healthcare products. Fast delivery, genuine
              products, and expert guidance at your fingertips.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/store">
                <Button
                  size="lg"
                  className="text-base px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Explore Products
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-4 rounded-full border-2 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#8BC34A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#333333]">100% Genuine</p>
                  <p className="text-xs text-[#666666]">Certified Products</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#8BC34A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#333333]">Fast Delivery</p>
                  <p className="text-xs text-[#666666]">Within 24 Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#8BC34A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#333333]">24/7 Support</p>
                  <p className="text-xs text-[#666666]">Expert Guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Card */}
        <div
          className="absolute bottom-8 right-8 hidden lg:block animate-fade-in"
          style={{ animationDelay: '500ms' }}
        >
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-[#EEEEEE]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#333333]">5,000+</p>
                <p className="text-sm text-[#666666]">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#333333] mb-4">
              Why Choose <span className="text-[#8BC34A]">Riyansh</span>
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Experience the difference with our commitment to quality, speed, and customer
              satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 border-2 border-[#EEEEEE] hover:border-[#8BC34A]/30 hover:shadow-2xl transition-all duration-500 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Package className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-3">Free Delivery</h3>
              <p className="text-[#666666] leading-relaxed mb-4">
                Get your orders delivered free of charge on all purchases above ₹500. Fast and
                reliable shipping nationwide.
              </p>
              <button className="inline-flex items-center text-[#8BC34A] font-semibold hover:gap-2 transition-all">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-[#EEEEEE] hover:border-[#8BC34A]/30 hover:shadow-2xl transition-all duration-500 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-3">100% Genuine</h3>
              <p className="text-[#666666] leading-relaxed mb-4">
                All our medicines are sourced directly from certified manufacturers. Your health is
                our top priority.
              </p>
              <button className="inline-flex items-center text-[#8BC34A] font-semibold hover:gap-2 transition-all">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>

            <div className="group bg-white rounded-2xl p-8 border-2 border-[#EEEEEE] hover:border-[#8BC34A]/30 hover:shadow-2xl transition-all duration-500 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#333333] mb-3">24/7 Support</h3>
              <p className="text-[#666666] leading-relaxed mb-4">
                Our expert pharmacists are available round the clock to answer your questions and
                provide guidance.
              </p>
              <button className="inline-flex items-center text-[#8BC34A] font-semibold hover:gap-2 transition-all">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gradient-to-b from-[#A5D6A7]/10 to-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#8BC34A]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8BC34A]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-[#8BC34A]/10 rounded-full mb-4">
              <TrendingUp className="h-5 w-5 text-[#8BC34A] mr-2" />
              <span className="text-sm font-semibold text-[#8BC34A]">Featured Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              Our Premium{' '}
              <span className="text-[#8BC34A] relative">
                Products
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C50 1.5 150 1.5 199 5.5"
                    stroke="#8BC34A"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Discover our carefully curated selection of premium pharmacy products for your health
              and wellness
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-2">No Products Available</h3>
              <p className="text-[#666666] mb-6">Check back soon for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link href="/store">
              <Button
                size="lg"
                variant="outline"
                className="group relative overflow-hidden border-2 border-[#8BC34A] text-[#8BC34A] hover:text-white px-8 py-4 text-base font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View All Products
                  <svg
                    className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-[#8BC34A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#8BC34A] via-[#7CB342] to-[#6FA839] overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              <defs>
                <pattern
                  id="newsletter-pattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="800" height="400" fill="url(#newsletter-pattern)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
            <svg
              className="w-10 h-10 text-white"
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

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Get Exclusive Deals & Updates
          </h2>
          <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get up to{' '}
            <span className="font-bold text-white">55% OFF</span> on your first order, plus health
            tips and new arrivals
          </p>

          {/* Enhanced Email Form */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-2 shadow-2xl hidden">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#8BC34A]/50 text-[#333333] placeholder-gray-400"
                  />
                </div>
                <Button
                  size="lg"
                  className="bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>No Spam Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Join 10,000+ Subscribers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-[#8BC34A]/10 rounded-full mb-4">
              <svg className="w-5 h-5 text-[#8BC34A] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-[#8BC34A]">Customer Reviews</span>
            </div>
            <h2 className="text-4xl font-bold text-[#333333] mb-4">
              What Our <span className="text-[#8BC34A]">Happy Customers</span> Say
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their healthcare needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group bg-white rounded-2xl p-8 border-2 border-[#EEEEEE] hover:border-[#8BC34A]/30 hover:shadow-2xl transition-all duration-500"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Quote Icon */}
                <div className="mb-6">
                  <svg
                    className="w-12 h-12 text-[#8BC34A]/20 group-hover:text-[#8BC34A]/30 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-[#666666] leading-relaxed mb-6 text-lg">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-4 pt-6 border-t-2 border-[#EEEEEE]">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#8BC34A]/20 group-hover:ring-[#8BC34A]/40 transition-all">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8BC34A] rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#333333] text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-[#8BC34A] font-medium">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
