'use client'

import { FileText, Scale, AlertCircle, Shield, Users, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const sections = [
    {
      icon: Users,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using the Riyansh website, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'These terms apply to all visitors, users, and others who access or use the service.',
      ],
    },
    {
      icon: FileText,
      title: 'Use License',
      content: [
        'Permission is granted to temporarily access and use our products for personal, non-commercial use only.',
        'You may not:',
        '• Modify or copy the materials',
        '• Use the materials for any commercial purpose',
        '• Remove any copyright or other proprietary notations',
        '• Transfer the materials to another person or entity',
        'This license shall automatically terminate if you violate any of these restrictions.',
      ],
    },
    {
      icon: Scale,
      title: 'Product Information',
      content: [
        'We strive to provide accurate product descriptions and pricing information.',
        'However, we do not warrant that product descriptions or other content on our website is accurate, complete, reliable, current, or error-free.',
        'We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.',
        'In the event that an item is mispriced, we may refuse or cancel any orders placed for the product at the incorrect price.',
      ],
    },
    {
      icon: Shield,
      title: 'Order Acceptance',
      content: [
        'Your order is an offer to purchase products from us.',
        'We reserve the right to accept or decline your order for any reason, including but not limited to:',
        '• Product availability',
        '• Errors in product descriptions or pricing',
        '• Errors in your order',
        '• Suspected fraudulent transactions',
        'If we decline your order after payment has been processed, we will issue a full refund.',
      ],
    },
    {
      icon: AlertCircle,
      title: 'User Accounts',
      content: [
        'You are responsible for maintaining the confidentiality of your account and password.',
        'You agree to:',
        '• Keep your account information current and accurate',
        '• Notify us immediately of any unauthorized access',
        '• Accept responsibility for all activities under your account',
        'We are not liable for any losses caused by unauthorized use of your account.',
      ],
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: [
        'All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of Riyansh or its content suppliers.',
        'The compilation of all content on this site is the exclusive property of Riyansh.',
        'You may not reproduce, distribute, modify, create derivative works, publicly display, or otherwise exploit any of our content without our prior written consent.',
      ],
    },
  ]

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#8BC34A] via-[#7CB342] to-[#8BC34A] py-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <Scale className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Legal Agreement</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
              Terms & Conditions
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Please read these terms carefully before using our website and making a purchase.
            </p>

            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Link href="/" className="hover:text-white transition-colors cursor-pointer">
                Home
              </Link>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-white font-bold">Terms & Conditions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#8BC34A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-12">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/5 rounded-2xl p-8 border border-[#8BC34A]/20">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to Riyansh. These Terms and Conditions govern your use of our website and
                the purchase of products from us. By accessing our website or making a purchase, you
                agree to be bound by these terms. Please read them carefully.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                <strong>Last Updated:</strong> January 2025
              </p>
            </div>

            {/* Terms Sections */}
            {sections.map((section, index) => (
              <div key={index} className="group">
                <div className="flex items-start gap-6 p-8 bg-white rounded-2xl border border-gray-200 hover:border-[#8BC34A] transition-all duration-300 shadow-sm hover:shadow-xl">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <section.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    <div className="space-y-2">
                      {section.content.map((item, idx) => (
                        <p key={idx} className="text-gray-700 leading-relaxed">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Additional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Limitation of Liability</h3>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall Riyansh or its suppliers be liable for any damages (including, without
                  limitation, damages for loss of data or profit, or due to business interruption) arising
                  out of the use or inability to use the materials on our website.
                  damages for loss of data or profit, or due to business interruption) arising out of the use or
                  inability to use the materials on our website.
                </p>
              </div>
            </div>
            {/* Contact Section */}
            <div className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/5 rounded-2xl p-8 border border-[#8BC34A]/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions About Terms?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions regarding these terms, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:riyanshamrit106@gmail.com" className="text-[#8BC34A] hover:underline">
                    riyanshamrit106@gmail.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+919370646279" className="text-[#8BC34A] hover:underline">
                    +91 9370646279
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

