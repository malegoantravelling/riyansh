'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, MapPin, X, Save, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'

interface Address {
  id: string
  address_line_1: string
  address_line_2?: string
  street_address: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
}

export default function AddressesPage() {
  const toast = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [formData, setFormData] = useState({
    address_line_1: '',
    address_line_2: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    is_default: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setAddresses(data || [])
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setPageLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.user) return

      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('user_addresses')
          .update(formData)
          .eq('id', editingAddress.id)

        if (error) throw error
      } else {
        // Create new address
        const { error } = await supabase.from('user_addresses').insert({
          ...formData,
          user_id: session.user.id,
        })

        if (error) throw error
      }

      await fetchAddresses()
      toast.success(
        editingAddress ? 'Address Updated!' : 'Address Added!',
        'Your address has been saved successfully'
      )
      resetForm()
    } catch (error: any) {
      console.error('Error saving address:', error)
      toast.error('Save Failed', error.message || 'Could not save address. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      is_default: address.is_default,
    })
    setShowForm(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const { error } = await supabase.from('user_addresses').delete().eq('id', addressId)

      if (error) throw error
      await fetchAddresses()
      toast.success('Address Deleted', 'The address has been removed successfully')
    } catch (error: any) {
      console.error('Error deleting address:', error)
      toast.error('Delete Failed', error.message || 'Could not delete address. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      address_line_1: '',
      address_line_2: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      is_default: false,
    })
    setEditingAddress(null)
    setShowForm(false)
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-32 h-32 border-8 border-[#8BC34A]/20 border-t-[#8BC34A] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-[#8BC34A]" />
            </div>
          </div>
          <p className="mt-6 text-lg font-semibold text-gray-600 animate-pulse">
            Loading your addresses...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#2d2d2d] mb-2">My Addresses</h1>
              <p className="text-sm text-gray-500">Manage your delivery addresses</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mt-[2vh] md:mt-0 px-6 py-4"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Address
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Address List */}
        {addresses.length === 0 ? (
          /* Enhanced Empty State */
          <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-12">
            <div className="text-center">
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/20 to-[#7CB342]/20 rounded-full blur-3xl" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                  <MapPin className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#2d2d2d] mb-4">No Addresses Yet</h2>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                Add your first delivery address to get started with seamless order fulfillment!
              </p>
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="rounded-xl shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Address
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <div
                key={address.id}
                className="group bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#8BC34A]/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#8BC34A]/5 to-[#7CB342]/5 p-4 border-b-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center md:gap-72 gap-56">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center shadow-lg">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      {address.is_default && (
                        <span className="px-3 py-1 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white text-sm font-bold rounded-full shadow-md flex items-center gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div className="p-6">
                  <div className="space-y-2">
                    <p className="font-semibold text-[#2d2d2d] text-lg">{address.address_line_1}</p>
                    {address.address_line_2 && (
                      <p className="text-gray-600">{address.address_line_2}</p>
                    )}
                    <p className="text-gray-600">{address.street_address}</p>
                    <p className="text-gray-600 font-medium">
                      {address.city}, {address.state} {address.zip_code}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 flex gap-2">
                  <Button
                    onClick={() => handleEdit(address)}
                    variant="outline"
                    className="flex-1 rounded-xl border-2 hover:border-[#8BC34A] hover:text-[#ffffff] transition-all"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(address.id)}
                    variant="outline"
                    className="rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Address Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-gray-100">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] p-6 flex items-center justify-between shadow-lg">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h2>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 border-2 border-white text-white backdrop-blur-sm"
                  size="icon"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <Label
                    htmlFor="address_line_1"
                    className="text-sm font-semibold text-[#2d2d2d] mb-2 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-[#8BC34A]" />
                    Address *
                  </Label>
                  <Input
                    id="address_line_1"
                    value={formData.address_line_1}
                    onChange={(e) => handleChange('address_line_1', e.target.value)}
                    required
                    className="h-12 border-2 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                    placeholder="Enter street address"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="street_address"
                    className="text-sm font-semibold text-[#2d2d2d] mb-2"
                  >
                    Street Address *
                  </Label>
                  <Input
                    id="street_address"
                    value={formData.street_address}
                    onChange={(e) => handleChange('street_address', e.target.value)}
                    required
                    className="h-12 border-2 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                    placeholder="Apt, suite, etc."
                  />
                </div>

                <div>
                  <Label
                    htmlFor="address_line_2"
                    className="text-sm font-semibold text-[#2d2d2d] mb-2"
                  >
                    Address Line 2
                    <span className="ml-2 text-xs text-gray-500 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="address_line_2"
                    value={formData.address_line_2}
                    onChange={(e) => handleChange('address_line_2', e.target.value)}
                    className="h-12 border-2 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                    placeholder="Additional address details"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-semibold text-[#2d2d2d] mb-2">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      required
                      className="h-12 border-2 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                      placeholder="City name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-semibold text-[#2d2d2d] mb-2">
                      State *
                    </Label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      required
                      className="h-12 w-full rounded-md border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all"
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="zip_code" className="text-sm font-semibold text-[#2d2d2d] mb-2">
                    ZIP Code *
                  </Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    required
                    className="h-12 border-2 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20"
                    placeholder="Postal code"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => handleChange('is_default', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A] cursor-pointer"
                  />
                  <Label
                    htmlFor="is_default"
                    className="text-sm font-medium text-[#2d2d2d] cursor-pointer"
                  >
                    Set as default address
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 rounded-xl border-2 h-12"
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingAddress ? 'Update Address' : 'Add Address'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
