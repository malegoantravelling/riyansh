'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Save, X, User, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'

export default function ProfilePage() {
  const toast = useToast()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
  })
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [originalProfile, setOriginalProfile] = useState({
    full_name: '',
    email: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
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
        })
        .eq('id', user.id)

      if (error) throw error

      setOriginalProfile(profile)
      setEditMode(false)
      toast.success('Profile Updated!', 'Your profile has been updated successfully')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Update Failed', error.message || 'Could not update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    setProfile(originalProfile)
    setEditMode(false)
  }

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Breadcrumb Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-[#2d2d2d] mb-2">My Profile</h1>
          <p className="text-sm text-gray-500">Manage your account information and preferences</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Profile Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <User className="h-10 w-10 text-[#8BC34A]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{profile.full_name || 'User'}</h2>
                  <p className="text-white/80 text-sm">{profile.email}</p>
                </div>
              </div>
              {!editMode ? (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="bg-white/20 hover:bg-white/30 border-2 border-white text-white backdrop-blur-sm px-3 md:px-4"
                >
                  <Edit className="h-5 w-5" />
                  <span className="hidden md:inline ml-2">Edit Profile</span>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-white text-[#ffffff] hover:bg-gray-50 shadow-lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={handleDiscard}
                    variant="outline"
                    disabled={loading}
                    className="bg-white/20 hover:bg-white/30 border-2 border-white text-white backdrop-blur-sm"
                  >
                    <X className="h-5 w-5 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="p-8 space-y-6">
            {/* Full Name Field */}
            <div className="space-y-3">
              <Label
                htmlFor="full_name"
                className="text-sm font-semibold text-[#2d2d2d] flex items-center gap-2"
              >
                <User className="h-4 w-4 text-[#8BC34A]" />
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  disabled={!editMode}
                  className={`h-14 text-base border-2 transition-all duration-300 ${
                    editMode
                      ? 'border-[#8BC34A]/30 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your full name"
                />
                {!editMode && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
                    <Edit className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-[#2d2d2d] flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-[#8BC34A]" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  value={profile.email}
                  disabled={true}
                  className="h-14 text-base border-2 border-gray-200 bg-gray-50 cursor-not-allowed"
                  placeholder="your@email.com"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50">
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  Email cannot be changed for security reasons
                </p>
              </div>
            </div>

            {/* Edit Mode Info Banner */}
            {editMode && (
              <div className="flex items-center gap-3 px-4 py-3 bg-[#8BC34A]/10 border border-[#8BC34A]/20 rounded-xl">
                <Edit className="h-5 w-5 text-[#8BC34A]" />
                <p className="text-sm text-[#2d2d2d]">
                  You're in edit mode. Make your changes and click "Save Changes" to update your
                  profile.
                </p>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <AlertCircle className="h-3 w-3" />
              All changes are saved securely and encrypted
            </p>
          </div>
        </div>

        {/* Additional Information Cards */}
      </div>
    </div>
  )
}
