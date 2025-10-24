'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Save, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
  })
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [originalProfile, setOriginalProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        
        // Get user profile from users table
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userProfile) {
          const profileData = {
            full_name: userProfile.full_name || '',
            email: userProfile.email || session.user.email || '',
            phone: userProfile.phone || '',
          }
          setProfile(profileData)
          setOriginalProfile(profileData)
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleEdit = () => {
    setEditMode(true)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq('id', user.id)

      if (error) throw error

      setOriginalProfile(profile)
      setEditMode(false)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    setProfile(originalProfile)
    setEditMode(false)
  }

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#333333]">Profile</h1>
          {!editMode && (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <div className="relative">
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                disabled={!editMode}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                value={profile.email}
                disabled={true} // Email cannot be changed
                className="mt-1 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!editMode}
                className="mt-1"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {editMode && (
            <div className="flex space-x-4 pt-4">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={handleDiscard} variant="outline" disabled={loading}>
                <X className="h-4 w-4 mr-2" />
                Discard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
