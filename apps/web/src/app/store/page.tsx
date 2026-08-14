'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'
import { Button } from '@/components/ui/button'
import { getCachedProducts, prioritizeAmritJuice } from '@/lib/productCache'
import { Search, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('default')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedAilments, setSelectedAilments] = useState<string[]>([])
  const [displayCount, setDisplayCount] = useState(9)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCachedProducts()
      if (Array.isArray(data) && data.length > 0) {
        setAllProducts(data)
      }
    } catch (err) {
      console.warn('[Store] Product fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('q')
    if (query) setSearchQuery(query)
  }, [])

  useEffect(() => {
    let result = [...allProducts]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) => p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query)
      )
    }

    if (sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else {
      result = prioritizeAmritJuice(result)
    }

    setProducts(result)
  }, [searchQuery, sortBy, selectedTypes, selectedBrands, selectedAilments, allProducts])

  const toggleFilterItem = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const popularProduct = allProducts.length > 0 ? allProducts[0] : null

  const FilterSidebar = (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal">
          Product Category
        </h3>
        <div className="space-y-2.5 text-sm text-stone">
          {[
            'Ayurvedic Juices & Tonics',
            'Capsules & Supplements',
            'Personal Care & Herbal Oils',
            'Health & Nutrition',
          ].map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-2.5 hover:text-forest">
              <input
                type="checkbox"
                checked={selectedTypes.includes(cat)}
                onChange={() => toggleFilterItem(cat, selectedTypes, setSelectedTypes)}
                className="h-3.5 w-3.5 rounded border-forest/30 text-forest focus:ring-forest"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal">
          Health Concern
        </h3>
        <div className="space-y-2.5 text-sm text-stone">
          {[
            'Immunity & Digestion',
            'Joint Pain & Mobility',
            'Diabetes & Blood Sugar',
            "Women's Health",
            'Strength & Stamina',
          ].map((concern) => (
            <label
              key={concern}
              className="flex cursor-pointer items-center gap-2.5 hover:text-forest"
            >
              <input
                type="checkbox"
                checked={selectedAilments.includes(concern)}
                onChange={() => toggleFilterItem(concern, selectedAilments, setSelectedAilments)}
                className="h-3.5 w-3.5 rounded border-forest/30 text-forest focus:ring-forest"
              />
              <span>{concern}</span>
            </label>
          ))}
        </div>
      </div>

      {popularProduct && (
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal">
            Popular Products
          </h3>
          <ProductCard product={popularProduct} />
        </div>
      )}

      <div className="rounded-2xl border border-forest/10 bg-ivory-deep/80 p-5">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal">
          Warning Information
        </h3>
        <p className="text-[11px] leading-relaxed text-stone">
          In compliance with Drug and Cosmetic Act standards, all Riyansh Multitrade Ayurvedic
          formulations are manufactured under certified GMP lab conditions. Consume as per directed
          dosage or consult an Ayurvedic physician for tailored wellness guidance.
        </p>
      </div>
    </div>
  )

  return (
    <div className="page-shell surface-band pb-16">
      <div className="container-editorial py-10 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-2">Catalog</p>
          <h1 className="font-display text-3xl font-medium tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
            Shop Ayurvedic supplements
          </h1>
          <p className="mt-3 text-stone">
            Juices, capsules, and herbal formulas for immunity, joint comfort, digestion, stamina,
            and women’s wellness — made by Riyansh Multitrade in Maharashtra. Use search and
            filters, or read our{' '}
            <Link href="/wellness" className="font-semibold text-forest hover:underline">
              wellness guides
            </Link>{' '}
            before you buy.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          <div className="flex items-center justify-between md:hidden">
            <Button
              onClick={() => setShowMobileSidebar(true)}
              variant="outline"
              className="rounded-full"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="relative md:col-span-9">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ayurvedic Product"
              className="surface-glass w-full rounded-full border-evergreen/10 py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-stone focus:border-forest/30 focus:outline-none"
            />
          </div>

          <div className="relative md:col-span-3">
            <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="surface-glass w-full appearance-none rounded-full border-evergreen/10 py-3 pl-9 pr-8 text-sm font-medium text-charcoal focus:border-forest/30 focus:outline-none"
            >
              <option value="default">Sort</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="sticky top-24 hidden self-start lg:col-span-3 lg:block">
            {FilterSidebar}
          </aside>

          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-forest/10 bg-white/70 py-16 text-center">
                <h3 className="font-display text-xl font-medium text-charcoal">
                  No Products Found
                </h3>
                <p className="mt-2 text-sm text-stone">
                  Try clearing search filters or browse all wellness items.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSortBy('default')
                    setSelectedTypes([])
                    setSelectedBrands([])
                    setSelectedAilments([])
                  }}
                  className="mt-5 rounded-full"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {products.slice(0, displayCount).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {displayCount < products.length && (
                  <div className="pb-8 pt-4 text-center">
                    <Button
                      onClick={() => setDisplayCount((prev) => prev + 6)}
                      className="rounded-full px-8"
                    >
                      Show More
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-0 z-[50] lg:hidden',
          showMobileSidebar ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-charcoal/40 transition-opacity',
            showMobileSidebar ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setShowMobileSidebar(false)}
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-ivory p-6 shadow-lift transition-transform duration-500 ease-premium',
            showMobileSidebar ? 'translate-y-0' : 'translate-y-full'
          )}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-medium">Filters</h2>
            <button
              type="button"
              onClick={() => setShowMobileSidebar(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/15"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {FilterSidebar}
          <Button className="mt-6 w-full rounded-full" onClick={() => setShowMobileSidebar(false)}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
