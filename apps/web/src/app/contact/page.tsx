'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, Mail, Send, MessageSquare, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { useApiClient } from '@/lib/api'

const inputClass =
  'w-full h-12 px-4 text-sm text-evergreen bg-white border border-evergreen/15 rounded-xl placeholder:text-dusty-olive focus:outline-none focus:border-evergreen/40 focus:ring-2 focus:ring-evergreen/15 transition-shadow glass-1'

export default function ContactPage() {
  const toast = useToast()
  const { apiFetch } = useApiClient()
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
      const response = await apiFetch('/api/contact/submit', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (response.success) {
        toast.success('Message Sent!', response.message)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        toast.error('Error', response.error || 'Failed to send message. Please try again.')
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to send message. Please try again.'
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
    <div className="page-shell text-evergreen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-evergreen py-16 sm:py-20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-black/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/25">
            <MessageSquare className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">We&apos;re Here to Help</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Contact Us
          </h1>

          <p className="text-white/90 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>

          <nav
            className="flex items-center justify-center gap-2 text-sm text-white/85 pt-1"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-70" />
            <span className="font-semibold text-white">Contact</span>
          </nav>
        </div>
      </section>

      {/* Get In Touch — form */}
      <section className="surface-mist relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-16 scale-x-150 rounded-b-[50%] bg-white/60 opacity-60" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#013220]/10 rounded-full border border-[#013220]/20">
              <Send className="h-4 w-4 text-[#013220]" />
              <span className="text-sm font-semibold text-[#013220]">Send Us a Message</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013220]">Get In Touch</h2>
            <p className="text-[#80866e] text-base max-w-lg mx-auto">
              Fill out the form below and our team will get back to you within 24 hours
            </p>
          </div>

          <div className="glass-2 rounded-2xl border border-evergreen/10 shadow-lift p-6 sm:p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="text-sm font-semibold text-[#013220]">
                    First Name <span className="text-[#013220]">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="text-sm font-semibold text-[#013220]">
                    Last Name <span className="text-[#013220]">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-[#013220]">
                  Email Address <span className="text-[#013220]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#80866e] text-sm font-medium">
                    @
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-sm font-semibold text-[#013220]">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-semibold text-[#013220]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 text-sm text-[#013220] bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl placeholder:text-[#80866e] focus:outline-none focus:bg-white focus:border-[#013220] focus:ring-1 focus:ring-[#013220] transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-13 sm:h-14 text-base font-bold bg-[#013220] hover:bg-[#012418] text-white rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    SEND MESSAGE
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Let's Connect */}
      <section className="surface-band py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#013220]/10 rounded-full border border-[#013220]/20">
              <Sparkles className="h-4 w-4 text-[#013220]" />
              <span className="text-sm font-semibold text-[#013220]">Contact Information</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013220]">
              Let&apos;s Connect
            </h2>
            <p className="text-[#80866e] text-base max-w-lg mx-auto">
              We&apos;re available 24/7 to assist you with any questions or concerns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="surface-glass rounded-2xl border-evergreen/10 p-8 sm:p-10 text-center hover:border-evergreen/30 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#013220] rounded-2xl mb-6">
                <Phone className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#013220] mb-3">Call Us</h3>
              <a
                href="tel:+918605911293"
                className="block text-lg font-semibold text-[#80866e] hover:text-[#013220] transition-colors mb-3"
              >
                +91 8605911293
              </a>
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-[#013220] rounded-full" />
                Mon-Sat, 9AM-6PM IST
              </div>
            </div>

            {/* Email */}
            <div className="surface-glass rounded-2xl border-evergreen/10 p-8 sm:p-10 text-center hover:border-evergreen/30 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#013220] rounded-2xl mb-6">
                <Mail className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#013220] mb-3">Email Us</h3>
              <a
                href="mailto:riyanshamrit106@gmail.com"
                className="block text-base sm:text-lg font-semibold text-[#80866e] hover:text-[#013220] transition-colors mb-3 break-all"
              >
                riyanshamrit106@gmail.com
              </a>
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-[#3B82F6] rounded-full" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
