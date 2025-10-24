'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-8 border-b border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-[#333333]">Contact</h1>
          <p className="text-[#666666] mt-2">Home / Contact</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-[#333333] text-center mb-8">Get In Touch</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              SEND MESSAGE
            </Button>
          </form>
        </div>

        {/* Offices */}
        <div>
          <h2 className="text-3xl font-bold text-[#333333] text-center mb-8">Offices</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['NEW YORK', 'LONDON', 'CANADA'].map((city) => (
              <div key={city} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-[#333333]">{city}</h3>
                <p className="text-[#666666] text-sm mb-4">
                  203 Fake St. Mountain View, San Francisco, California, USA
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <section className="py-16 bg-[#A5D6A7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A] rounded-full mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="text-[#666666]">
                Riyansh Ayurvedic Center,
                <br />
                Mumbai, Maharashtra, India
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A] rounded-full mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p className="text-[#666666]">+91 9370646279</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A] rounded-full mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-[#666666]">riyanshamrit106@gmail.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
