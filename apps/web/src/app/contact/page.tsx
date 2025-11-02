'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Phone, Mail, Send, MessageSquare, ChevronDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { api } from '@/lib/api'

export default function ContactPage() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('📝 Submitting contact form:', formData)
      const response = await api.post('/api/contact/submit', formData)
      console.log('📧 API Response:', response)

      if (response.success) {
        toast.success('Message Sent!', response.message)
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        console.error('❌ API Error:', response.error)
        toast.error('Error', response.error || 'Failed to send message. Please try again.')
      }
    } catch (error: any) {
      console.error('❌ Contact form error:', error)
      console.error('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response,
      })

      // Try to extract error message from response
      let errorMessage = 'Failed to send message. Please try again.'
      if (error.response) {
        try {
          const errorData = await error.response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
        }
      }

      toast.error('Error', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Enhanced Modern Hero Header */}
      <div className="relative bg-gradient-to-r from-[#8BC34A] via-[#7CB342] to-[#8BC34A] py-20 overflow-hidden">
        {/* Dotted Pattern Background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <MessageSquare className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">We&apos;re Here to Help</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
              Contact Us
            </h1>

            <p className="text-white/95 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll
              respond as soon as possible.
            </p>

            <div className="flex items-center justify-center space-x-3 text-white/90 mt-4">
              <Link href="/" className="hover:text-white transition-colors cursor-pointer">
                Home
              </Link>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-white font-bold">Contact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Contact Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#8BC34A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BC34A]/10 rounded-full border border-[#8BC34A]/20 mb-4">
              <Send className="h-4 w-4 text-[#8BC34A]" />
              <span className="text-sm font-semibold text-[#8BC34A]">Send Us a Message</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2d2d2d]">Get In Touch</h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
              Fill out the form below and our team will get back to you within 24 hours
            </p>
          </div>

          {/* Enhanced Form Card */}
          <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-gray-100 hover:border-[#8BC34A]/30 transition-all duration-500">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-bl-full" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-base font-semibold text-[#2d2d2d]">
                    First Name <span className="text-[#8BC34A]">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your first name"
                      className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-base font-semibold text-[#2d2d2d]">
                    Last Name <span className="text-[#8BC34A]">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                    className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-[#2d2d2d]">
                  Email Address <span className="text-[#8BC34A]">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-base font-semibold text-[#2d2d2d]">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  className="h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-semibold text-[#2d2d2d]">
                  Message
                </Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/20 transition-all duration-300 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    SEND MESSAGE
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Info Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(139, 195, 74, 0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BC34A]/10 rounded-full border border-[#8BC34A]/20 mb-4">
              <Sparkles className="h-4 w-4 text-[#8BC34A]" />
              <span className="text-sm font-semibold text-[#8BC34A]">Contact Information</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2d2d2d]">
              Let&apos;s Connect
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
              We&apos;re available 24/7 to assist you with any questions or concerns
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Phone Card */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#8BC34A]/40 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/0 via-[#8BC34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Top decorative line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8BC34A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Icon with enhanced styling */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-3xl mb-7 shadow-2xl group-hover:shadow-[#8BC34A]/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative">
                  <Phone className="h-10 w-10 text-white drop-shadow-lg" />
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-[#8BC34A] rounded-3xl opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
                </div>

                <h3 className="text-2xl font-extrabold text-[#2d2d2d] mb-5 group-hover:text-[#8BC34A] transition-colors duration-300 tracking-tight">
                  Call Us
                </h3>

                <a
                  href="tel:+919370646279"
                  className="block text-xl text-[#666666] hover:text-[#8BC34A] transition-colors font-semibold mb-3 tracking-tight"
                >
                  +91 9370646279
                </a>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Mon-Sat, 9AM-6PM IST</span>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#8BC34A]/40 transform hover:-translate-y-3 hover:scale-[1.02] overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/0 via-[#8BC34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Top decorative line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8BC34A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Icon with enhanced styling */}
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-3xl mb-7 shadow-2xl group-hover:shadow-[#8BC34A]/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative">
                  <Mail className="h-10 w-10 text-white drop-shadow-lg" />
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-[#8BC34A] rounded-3xl opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
                </div>

                <h3 className="text-2xl font-extrabold text-[#2d2d2d] mb-5 group-hover:text-[#8BC34A] transition-colors duration-300 tracking-tight">
                  Email Us
                </h3>

                <a
                  href="mailto:riyanshamrit106@gmail.com"
                  className="block text-lg text-[#666666] hover:text-[#8BC34A] transition-colors font-semibold mb-3 break-all px-4"
                >
                  riyanshamrit106@gmail.com
                </a>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
