'use client'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/motion/Reveal'
import { ArrowRight } from 'lucide-react'

interface HomeProductsProps {
  products: any[]
  loading: boolean
}

export function HomeProducts({ products, loading }: HomeProductsProps) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="container-editorial">
        <Reveal>
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="eyebrow mb-3">Featured Collection</p>
              <h2 className="font-display text-3xl font-medium tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
                Our premium products
              </h2>
              <p className="mt-3 text-stone">
                Curated Ayurvedic essentials, chosen for purity and everyday wellness.
              </p>
            </div>
            <Link href="/store" className="shrink-0">
              <Button variant="outline" className="rounded-full">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <Reveal key={product.id} delay={Math.min(i * 0.06, 0.36)}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-forest/10 bg-white/70 py-16 text-center">
            <p className="text-stone">No products available at the moment.</p>
            <Link href="/store" className="mt-4 inline-block">
              <Button className="rounded-full">Browse Store</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
