'use client'

import { useEffect, useState } from 'react'
import { getCachedProducts } from '@/lib/productCache'
import HomeSeoContent, { homeFaqs } from '@/components/HomeSeoContent'
import { JsonLd } from '@/components/JsonLd'
import { faqJsonLd } from '@/lib/seo'
import { HomeHero } from '@/components/sections/home/HomeHero'
import { HomeFeatures } from '@/components/sections/home/HomeFeatures'
import { HomeProducts } from '@/components/sections/home/HomeProducts'
import { HomeNewsletter } from '@/components/sections/home/HomeNewsletter'
import { HomeTestimonials } from '@/components/sections/home/HomeTestimonials'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCachedProducts()
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedProducts(data.slice(0, 8))
        }
      } catch (err) {
        console.warn('Product fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <HomeHero />
      <HomeFeatures />
      <HomeProducts products={featuredProducts} loading={loading} />
      <HomeNewsletter />
      <HomeTestimonials />
      <HomeSeoContent />
      <JsonLd
        data={faqJsonLd(homeFaqs.map((item) => ({ question: item.q, answer: item.a })))}
      />
    </div>
  )
}
