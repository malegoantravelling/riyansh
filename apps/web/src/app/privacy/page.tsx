'use client'

import { Shield, Lock, Eye, FileText, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: [
        'We collect information that you provide directly to us when you:',
        '• Create an account or make a purchase',
        '• Subscribe to our newsletter',
        '• Contact customer support',
        '• Participate in surveys or promotional events',
        '• Post reviews or comments on our products',
        'This information may include your name, email address, phone number, shipping address, billing information, and payment details.',
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'We use the information we collect to:',
        '• Process and fulfill your orders',
        '• Send you order confirmations and updates',
        '• Respond to your inquiries and provide customer support',
        '• Send you marketing communications (with your consent)',
        '• Improve our products and services',
        '• Personalize your shopping experience',
        '• Detect and prevent fraud',
        '• Comply with legal obligations',
      ],
    },
    {
      icon: Lock,
      title: 'Information Sharing',
      content: [
        'We do not sell your personal information. We may share your information with:',
        '• Service providers who assist us in operating our website and conducting our business',
        '• Payment processors to complete your transactions',
        '• Shipping carriers to deliver your orders',
        '• Legal authorities when required by law',
        'All third parties are required to maintain the confidentiality of your information.',
      ],
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your personal information:',
        '• SSL encryption for all data transmissions',
        '• Secure payment gateways (Razorpay)',
        '• Regular security audits and updates',
        '• Access controls and authentication measures',
        '• Firewall and intrusion detection systems',
        'However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.',
      ],
    },
    {
      icon: Lock,
      title: 'Your Rights',
      content: [
        'You have the following rights regarding your personal information:',
        '• Access: Request a copy of the personal information we hold about you',
        '• Correction: Request correction of inaccurate information',
        '• Deletion: Request deletion of your personal information',
        '• Objection: Object to processing of your personal information',
        '• Portability: Request transfer of your data',
        'To exercise these rights, please contact us at riyanshamrit106@gmail.com',
      ],
    },
    {
      icon: Shield,
      title: 'Cookies and Tracking',
      content: [
        'We use cookies and similar technologies to:',
        '• Remember your preferences and settings',
        '• Analyze website traffic and usage patterns',
        '• Personalize content and advertisements',
        '• Enable social media features',
        'You can control cookies through your browser settings. However, disabling cookies may affect website functionality.',
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
              <Shield className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Your Privacy Matters</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
              Privacy Policy
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal
              information.
            </p>

            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Link href="/" className="hover:text-white transition-colors cursor-pointer">
                Home
              </Link>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-white font-bold">Privacy Policy</span>
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
                At Riyansh, we understand the importance of your privacy. This Privacy Policy
                explains how we collect, use, disclose, and protect your personal information when
                you visit our website or make a purchase. By using our services, you agree to the
                collection and use of information in accordance with this policy.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                <strong>Last Updated:</strong> January 2025
              </p>
            </div>

            {/* Policy Sections */}
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not directed to individuals under the age of 18. We do not
                  knowingly collect personal information from children. If you believe we have
                  collected information from a child, please contact us immediately.
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Changes to This Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any
                  changes by posting the new Privacy Policy on this page and updating the &quot; Last
                  Updated&quot; date. You are advised to review this Privacy Policy periodically.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/5 rounded-2xl p-8 border border-[#8BC34A]/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please
                contact us:
              </p>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:riyanshamrit106@gmail.com"
                    className="text-[#8BC34A] hover:underline"
                  >
                    riyanshamrit106@gmail.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+919370646279" className="text-[#8BC34A] hover:underline">
                    +91 9370646279
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Malegaon, Nashik District, Maharashtra, 423200
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
