import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Upload, X, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.tsx'
import Toast, { ToastType } from '@/components/SuccessToast'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>('all')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    productId: string | null
    productName: string
  }>({
    isOpen: false,
    productId: null,
    productName: '',
  })
  const [toast, setToast] = useState<{
    isOpen: boolean
    type: ToastType
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  })
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_at_price: '',
    category_id: '',
    image_url: '',
    stock_quantity: '',
    is_featured: false,
    is_active: true,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await api.get('/api/products')
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await api.get('/api/categories')
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: '' })
  }

  const showToast = (type: ToastType, title: string, message: string) => {
    setToast({ isOpen: true, type, title, message })
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null

    setUploading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', imageFile)

      const response = await fetch('https://riyanshamrit.com/api/products/upload-image', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return data.imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      showToast('error', 'Upload Failed', 'Failed to upload image. Please try again.')
      return null
    } finally {
      setUploading(false)
    }
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Upload image first if there's a new image
    let imageUrl = formData.image_url
    if (imageFile) {
      const uploadedUrl = await uploadImage()
      if (!uploadedUrl) {
        // Toast already shown in uploadImage function
        return
      }
      imageUrl = uploadedUrl
    }

    // Auto-generate slug if empty
    const slug = formData.slug || generateSlug(formData.name)

    const productData = {
      ...formData,
      slug,
      image_url: imageUrl || null,
      category_id: formData.category_id || null,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
    }

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, productData)
        showToast('success', 'Success!', 'Product updated successfully!')
      } else {
        await api.post('/api/products', productData)
        showToast('success', 'Success!', 'Product created successfully!')
      }

      setShowForm(false)
      setEditingProduct(null)
      resetForm()
      fetchProducts()
    } catch (error: any) {
      console.error('Error saving product:', error)
      showToast('error', 'Error', `Failed to save product: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDelete = async (id: string) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      setDeleteModal({
        isOpen: true,
        productId: id,
        productName: product.name,
      })
    }
  }

  const confirmDelete = async () => {
    if (!deleteModal.productId) return

    try {
      await api.delete(`/api/products/${deleteModal.productId}`)
      fetchProducts()
      setDeleteModal({ isOpen: false, productId: null, productName: '' })
      showToast('success', 'Success!', 'Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('error', 'Error', 'Failed to delete product')
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || '',
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      stock_quantity: product.stock_quantity.toString(),
      is_featured: product.is_featured,
      is_active: product.is_active,
    })
    setImagePreview(product.image_url || '')
    setImageFile(null)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      compare_at_price: '',
      category_id: '',
      image_url: '',
      stock_quantity: '',
      is_featured: false,
      is_active: true,
    })
    setImageFile(null)
    setImagePreview('')
  }

  // Filter products based on search term and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && product.is_active) ||
      (statusFilter === 'inactive' && !product.is_active)

    const matchesPriceRange = (() => {
      const price = product.price
      switch (priceRangeFilter) {
        case 'under-100':
          return price < 100
        case '100-500':
          return price >= 100 && price <= 500
        case '500-1000':
          return price >= 500 && price <= 1000
        case 'over-1000':
          return price > 1000
        default:
          return true
      }
    })()

    return matchesSearch && matchesCategory && matchesStatus && matchesPriceRange
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={priceRangeFilter}
              onChange={(e) => setPriceRangeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            >
              <option value="all">All Prices</option>
              <option value="under-100">Under ₹100</option>
              <option value="100-500">₹100 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="over-1000">Over ₹1000</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const newName = e.target.value
                  setFormData({
                    ...formData,
                    name: newName,
                    slug: !editingProduct ? generateSlug(newName) : formData.slug,
                  })
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL-friendly name)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Auto-generated from product name"
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="compare_at_price">Compare at Price</Label>
              <Input
                id="compare_at_price"
                type="number"
                step="0.01"
                value={formData.compare_at_price}
                onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <Label>Product Image</Label>
              <div className="mt-2">
                {imagePreview || formData.image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Product preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2 flex gap-4">
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : editingProduct ? 'Update' : 'Create'} Product
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                  resetForm()
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ||
              categoryFilter !== 'all' ||
              statusFilter !== 'all' ||
              priceRangeFilter !== 'all'
                ? 'No products match your current filters. Try adjusting your search criteria.'
                : 'No products available. Add your first product to get started.'}
            </p>
            {!searchTerm &&
              categoryFilter === 'all' &&
              statusFilter === 'all' &&
              priceRangeFilter === 'all' && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Button>
              )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.stock_quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        itemName={deleteModal.productName}
      />

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.type === 'success' ? 3000 : 4000}
      />
    </div>
  )
}
