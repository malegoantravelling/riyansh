'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { Filter, SlidersHorizontal, X, ChevronDown } from 'lucide-react'

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [selectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const productsPerPage = 12

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const endpoint = selectedCategory
        ? `/api/products?category=${selectedCategory}`
        : '/api/products'
      const data = await api.get(endpoint)
      const productsArray = Array.isArray(data) ? data : []
      setAllProducts(productsArray)
      applyFilters(productsArray)
    } catch (error) {
      console.error('Error fetching products:', error)
      setAllProducts([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = useCallback(
    (productsToFilter = allProducts) => {
      let filtered = [...productsToFilter]

      // Apply price filter
      filtered = filtered.filter(
        (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
      )

      // Apply sorting
      switch (sortBy) {
        case 'price-low-high':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high-low':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          filtered.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          break
        default:
          // Keep original order
          break
      }

      setProducts(filtered)
      setCurrentPage(1) // Reset to first page when filters change
    },
    [priceRange, sortBy, allProducts]
  )

  const resetFilters = () => {
    setPriceRange([0, 10000])
    setSortBy('default')
    setProducts(allProducts)
    setCurrentPage(1)
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    applyFilters()
  }, [priceRange, sortBy, applyFilters])

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Breadcrumb Header with Modern Design */}
      <div className="relative bg-[#8BC34A] py-20 overflow-hidden">
        {/* Dotted Grid Pattern Background - Same as Newsletter Section */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
              Our Store
              <span className="block text-2xl md:text-3xl font-normal text-white/90 mt-3">
                Discover Premium Wellness Products
              </span>
            </h1>
            <p className="text-white/95 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of high-quality pharmacy and wellness products
            </p>
            <div className="flex items-center justify-center space-x-3 mt-6 text-white/90">
              <span className="hover:text-white transition-colors cursor-pointer">Home</span>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-white font-bold">Store</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full justify-between px-6 py-4"
            size="lg"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters & Sorting
            </span>
            {showFilters ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Professional Sidebar */}
          <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              {/* Price Filter Card with Modern Design */}
              <div className="relative bg-white rounded-3xl border-2 border-gray-100 p-7 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-full blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="p-3 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                      <SlidersHorizontal className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-[#2d2d2d]">Price Range</h2>
                      <p className="text-xs text-gray-500">Filter by price</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#8BC34A] hover:accent-[#7CB342] shadow-inner"
                      style={{
                        background: `linear-gradient(to right, #8BC34A 0%, #8BC34A ${
                          (priceRange[1] / 10000) * 100
                        }%, #e5e7eb ${(priceRange[1] / 10000) * 100}%, #e5e7eb 100%)`,
                      }}
                    />
                    <div className="flex justify-between mt-5 gap-3">
                      <div className="flex-1 px-5 py-3 bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/10 rounded-xl border-2 border-[#8BC34A]/20">
                        <span className="text-xs text-gray-600 block mb-1">Min</span>
                        <span className="text-base font-bold text-[#8BC34A]">₹{priceRange[0]}</span>
                      </div>
                      <div className="flex-1 px-5 py-3 bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/10 rounded-xl border-2 border-[#8BC34A]/20">
                        <span className="text-xs text-gray-600 block mb-1">Max</span>
                        <span className="text-base font-bold text-[#8BC34A]">₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={resetFilters}
                    variant="outline"
                    className="w-full border-2 border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white transition-all duration-300 rounded-xl font-semibold py-6 group/btn"
                    size="lg"
                  >
                    <X className="h-4 w-4 mr-2 group-hover/btn:rotate-90 transition-transform duration-300" />
                    Reset Filters
                  </Button>
                </div>
              </div>

              {/* Enhanced Info Card with Modern Gradient */}
              <div className="relative bg-gradient-to-br from-[#8BC34A] via-[#7CB342] to-[#689F38] rounded-3xl p-7 text-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/50 rounded-full blur-2xl" />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Filter className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">Need Help?</h3>
                      <p className="text-sm text-white/95 leading-relaxed">
                        Our expert team is ready to help you find the perfect products for your
                        wellness journey
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full bg-white text-[#8BC34A] hover:bg-white/90 border-0 font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-4"
                  >
                    Contact Us
                  </Button>
                </div>
              </div>

              {/* Additional Stats Card */}
              <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-lg">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-2xl mb-2">
                    <span className="text-2xl font-bold text-white">{products.length}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#2d2d2d]">Products Available</h4>
                    <p className="text-sm text-gray-500 mt-1">High quality wellness items</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Enhanced Modern Toolbar */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-6 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8BC34A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8BC34A]"></span>
                  </div>
                  <div>
                    <p className="text-[#666666] font-medium text-sm">
                      Showing{' '}
                      <span className="text-[#8BC34A] font-bold text-base">
                        {currentProducts.length}
                      </span>{' '}
                      of{' '}
                      <span className="text-[#8BC34A] font-bold text-base">{products.length}</span>{' '}
                      products
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Browse our premium collection</p>
                  </div>
                </div>

                <div className="relative w-full sm:w-72">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SlidersHorizontal className="h-4 w-4 text-[#8BC34A]" />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none border-2 border-gray-200 rounded-xl pl-12 pr-12 py-4 text-sm font-semibold text-[#2d2d2d] bg-white hover:border-[#8BC34A] focus:border-[#8BC34A] focus:outline-none focus:ring-2 focus:ring-[#8BC34A]/20 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8BC34A] pointer-events-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {currentProducts.length === 0 ? (
                  <div className="text-center py-24 px-6">
                    <div className="relative inline-flex items-center justify-center mb-8">
                      <div className="absolute w-32 h-32 bg-gradient-to-br from-[#8BC34A]/20 to-[#7CB342]/20 rounded-full blur-2xl" />
                      <div className="relative flex items-center justify-center w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full border-4 border-white shadow-xl">
                        <Filter className="h-14 w-14 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-[#2d2d2d] mb-3">No Products Found</h3>
                    <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                      We couldn&apos;t find any products matching your criteria. Try adjusting your
                      filters or browse our full collection.
                    </p>
                    <Button
                      onClick={resetFilters}
                      size="lg"
                      className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {currentProducts.map((product, index) => (
                        <div
                          key={product.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Modern Pagination */}
                    {totalPages > 1 && (
                      <div className="flex flex-wrap justify-center items-center gap-3 mt-16">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="border-2 border-gray-200 hover:border-[#8BC34A] hover:bg-[#8BC34A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-xl px-6 shadow-sm hover:shadow-md"
                        >
                          <ChevronDown className="h-4 w-4 rotate-90 mr-2" />
                          Previous
                        </Button>

                        <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                              pageNum = i + 1
                            } else if (currentPage <= 3) {
                              pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i
                            } else {
                              pageNum = currentPage - 2 + i
                            }
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                size="lg"
                                onClick={() => setCurrentPage(pageNum)}
                                className={`
                                  min-w-[3.5rem] h-12 rounded-xl font-bold transition-all duration-300
                                  ${
                                    currentPage === pageNum
                                      ? 'bg-gradient-to-br from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white shadow-lg hover:shadow-xl scale-110 border-0'
                                      : 'border-0 bg-white hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] shadow-sm hover:shadow-md'
                                  }
                                `}
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="border-2 border-gray-200 hover:border-[#8BC34A] hover:bg-[#8BC34A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-xl px-6 shadow-sm hover:shadow-md"
                        >
                          Next
                          <ChevronDown className="h-4 w-4 -rotate-90 ml-2" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
