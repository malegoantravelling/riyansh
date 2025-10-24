'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(false)
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
      resetForm()
    } catch (error: any) {
      console.error('Error saving address:', error)
      alert('Error saving address: ' + error.message)
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
    } catch (error: any) {
      console.error('Error deleting address:', error)
      alert('Error deleting address: ' + error.message)
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

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#333333]">Addresses</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Address
          </Button>
        </div>

        {/* Address List */}
        <div className="space-y-4 mb-6">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#8BC34A]" />
                    {address.is_default && (
                      <span className="bg-[#8BC34A] text-white text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-medium">{address.address_line_1}</p>
                  {address.address_line_2 && (
                    <p className="text-gray-600">{address.address_line_2}</p>
                  )}
                  <p className="text-gray-600">{address.street_address}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} {address.zip_code}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleEdit(address)} variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(address.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No addresses found. Add your first address to get started.</p>
            </div>
          )}
        </div>

        {/* Address Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="address_line_1">Address *</Label>
                  <Input
                    id="address_line_1"
                    value={formData.address_line_1}
                    onChange={(e) => handleChange('address_line_1', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="street_address">Street Address *</Label>
                  <Input
                    id="street_address"
                    value={formData.street_address}
                    onChange={(e) => handleChange('street_address', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address_line_2">Address Line 2</Label>
                  <Input
                    id="address_line_2"
                    value={formData.address_line_2}
                    onChange={(e) => handleChange('address_line_2', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      required
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  <Label htmlFor="zip_code">ZIP Code *</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default}
                    onChange={(e) => handleChange('is_default', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is_default">Set as default address</Label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                  </Button>
                  <Button type="button" onClick={resetForm} variant="outline">
                    Cancel
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
