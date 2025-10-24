'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [selectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [sortBy, setSortBy] = useState('default')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9

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
    setPriceRange([0, 1500])
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
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-8 border-b border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#333333]">Store</h1>
          <p className="text-[#666666] mt-2">Home / Store</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-[#EEEEEE] p-6">
              <h2 className="font-bold text-lg mb-4 uppercase">Filter By Price</h2>
              <div className="mb-6">
                <input
                  type="range"
                  min="0"
                  max="1500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-[#8BC34A]"
                />
                <div className="flex justify-between mt-2 text-sm text-[#666666]">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              <Button onClick={resetFilters} className="w-full" size="sm">
                Reset Filters
              </Button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-[#666666]">
                Showing {currentProducts.length} of {products.length} products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-[#CCCCCC] rounded px-4 py-2 text-sm"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-[#666666]">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {currentProducts.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-[#666666]">No products found matching your criteria.</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
