'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'
import { Button } from '@/components/ui/button'
import { getCachedProducts, prioritizeAmritJuice } from '@/lib/productCache'
import { Search, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'

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
      // Use in-memory cached products — 0ms on repeated loads, ~300ms only on first cold load
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

  // Filter & Search Logic
  useEffect(() => {
    let result = [...allProducts]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    // Sort filter
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

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Top Controls Bar: Search & Sort Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-2">
            <Button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              variant="outline"
              className="border-gray-300 text-gray-700"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search Input (Left 9 columns on desktop) */}
          <div className="md:col-span-9 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ayurvedic Product"
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F7F5] border border-transparent rounded-md text-sm text-[#1A1A1A] placeholder-gray-400 focus:bg-white focus:border-gray-300 focus:outline-none transition-all"
            />
          </div>

          {/* Sort Dropdown (Right 3 columns on desktop) */}
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#F7F7F5] border border-transparent rounded-md text-sm text-[#1A1A1A] font-medium appearance-none focus:bg-white focus:border-gray-300 focus:outline-none cursor-pointer transition-all"
            >
              <option value="default">Sort</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Main Content: Left Sidebar + Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Widgets */}
          <aside className={`lg:col-span-3 space-y-6 ${showMobileSidebar ? 'block' : 'hidden lg:block'}`}>
            
            {/* Widget 1: FILTER BY CATEGORY */}
            <div className="bg-[#F9F9F7] p-5 rounded-md border border-gray-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-3">
                PRODUCT CATEGORY
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                {['Ayurvedic Juices & Tonics', 'Capsules & Supplements', 'Personal Care & Herbal Oils', 'Health & Nutrition'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer hover:text-[#5B8C51]">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(cat)}
                      onChange={() => toggleFilterItem(cat, selectedTypes, setSelectedTypes)}
                      className="rounded border-gray-300 text-[#5B8C51] focus:ring-[#5B8C51] h-3.5 w-3.5"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Widget 2: FILTER BY HEALTH CONCERN */}
            <div className="bg-[#F9F9F7] p-5 rounded-md border border-gray-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-3">
                HEALTH CONCERN
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                {['Immunity & Digestion', 'Joint Pain & Mobility', 'Diabetes & Blood Sugar', "Women's Health", 'Strength & Stamina'].map((concern) => (
                  <label key={concern} className="flex items-center gap-2.5 cursor-pointer hover:text-[#5B8C51]">
                    <input
                      type="checkbox"
                      checked={selectedAilments.includes(concern)}
                      onChange={() => toggleFilterItem(concern, selectedAilments, setSelectedAilments)}
                      className="rounded border-gray-300 text-[#5B8C51] focus:ring-[#5B8C51] h-3.5 w-3.5"
                    />
                    <span>{concern}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Widget 4: POPULAR PRODUCTS */}
            {popularProduct && (
              <div className="bg-[#F9F9F7] p-5 rounded-md border border-gray-100">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-3">
                  POPULAR PRODUCTS
                </h3>
                <ProductCard product={popularProduct} />
              </div>
            )}

            {/* Widget 5: WARNING INFORMATION */}
            <div className="bg-[#F9F9F7] p-5 rounded-md border border-gray-100 space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-1">
                WARNING INFORMATION
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                In compliance with Drug and Cosmetic Act standards, all Riyansh Multitrade Ayurvedic formulations are manufactured under certified GMP lab conditions. Consume as per directed dosage or consult an Ayurvedic physician for tailored wellness guidance.
              </p>
            </div>
          </aside>

          {/* Right Product Grid Column */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-[#F9F9F7] rounded-md border border-gray-100">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">No Products Found</h3>
                <p className="text-xs text-gray-500 mb-4">Try clearing search filters or browse all wellness items.</p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSortBy('default')
                    setSelectedTypes([])
                    setSelectedBrands([])
                    setSelectedAilments([])
                  }}
                  className="bg-[#5B8C51] text-white hover:bg-[#4E7A45] text-xs px-4 py-2"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {products.slice(0, displayCount).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Show More Button */}
                {displayCount < products.length && (
                  <div className="text-center pt-4 pb-8">
                    <Button
                      onClick={() => setDisplayCount((prev) => prev + 6)}
                      className="bg-[#5B8C51] text-white hover:bg-[#4E7A45] font-semibold text-xs px-6 py-2.5 rounded-md shadow-sm transition-all"
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
    </div>
  )
}
