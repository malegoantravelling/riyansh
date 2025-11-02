'use client'

import { RotateCcw, Clock, AlertCircle, CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function CancellationRefundPage() {
  const refundPolicy = [
    {
      icon: Clock,
      title: 'Refund Processing Time',
      details: [
        'Refunds are processed within 5-10 business days after receiving the returned product',
        'The refund amount will be credited to your original payment method',
        'Bank transfers may take an additional 3-5 business days',
        'You will receive an email confirmation once the refund is processed',
      ],
    },
    {
      icon: CheckCircle2,
      title: 'Eligible for Refund',
      conditions: [
        'Product is unused, unopened, and in original packaging',
        'Returns initiated within 7 days of delivery',
        'Product has manufacturing defects',
        'Wrong product delivered',
        'Product damaged during shipping',
        'Incomplete order received',
      ],
    },
    {
      icon: XCircle,
      title: 'Not Eligible for Refund',
      conditions: [
        'Product used or opened (unless defective)',
        'Return initiated after 7 days of delivery',
        'Product damaged due to misuse',
        'Returned without original packaging',
        'Personalized or custom-made products',
        'Pharmaceutical or medical products (if opened)',
      ],
    },
  ]

  const returnSteps = [
    {
      step: '1',
      title: 'Initiate Return',
      description: 'Contact us or use the return portal within 7 days',
    },
    {
      step: '2',
      title: 'Get Authorization',
      description: 'Receive return authorization and instructions',
    },
    {
      step: '3',
      title: 'Package Product',
      description: 'Pack item in original packaging with all accessories',
    },
    {
      step: '4',
      title: 'Ship Back',
      description: 'Ship to our return center using provided label',
    },
    {
      step: '5',
      title: 'Receive Refund',
      description: 'Get refund credited within 5-10 business days',
    },
  ]

  const cancellationPolicy = [
    {
      title: 'Before Shipping',
      details: [
        'Orders can be cancelled anytime before shipment',
        'Full refund will be processed within 2-3 business days',
        'Contact us via email or phone to cancel',
        'Cancellation confirmation will be sent via email',
      ],
      color: 'green',
    },
    {
      title: 'After Shipping',
      details: [
        'Order cannot be cancelled once shipped',
        'Return request can be placed after receiving the product',
        'Follow standard return and refund policy',
        'Customer responsible for return shipping costs',
      ],
      color: 'orange',
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
              <RotateCcw className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Easy Returns & Refunds</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
              Cancellation & Refund Policy
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Our commitment to your satisfaction with hassle-free returns and refunds.
            </p>

            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Link href="/" className="hover:text-white transition-colors cursor-pointer">
                Home
              </Link>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-white font-bold">Cancellation & Refund</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#8BC34A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-16">
            {/* Overview */}
            <div className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/5 rounded-2xl p-8 border border-[#8BC34A]/20">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Policy Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#8BC34A] mb-2">7 Days</div>
                  <div className="text-gray-700">Return Window</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#8BC34A] mb-2">5-10 Days</div>
                  <div className="text-gray-700">Refund Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#8BC34A] mb-2">100%</div>
                  <div className="text-gray-700">Satisfaction Guarantee</div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Order Cancellation Policy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cancellationPolicy.map((policy, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${
                      policy.color === 'green'
                        ? 'from-green-50 to-green-100 border-green-200'
                        : 'from-orange-50 to-orange-100 border-orange-200'
                    } rounded-2xl p-8 border`}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{policy.title}</h3>
                    <ul className="space-y-3">
                      {policy.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-[#8BC34A] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Policy Details */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Refund Policy Details
              </h2>
              <div className="space-y-8">
                {refundPolicy.map((policy, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 p-8 bg-white rounded-2xl border border-gray-200 hover:border-[#8BC34A] transition-all duration-300 shadow-sm"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center">
                      <policy.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900">{policy.title}</h3>
                      <ul className="space-y-2">
                        {policy.details &&
                          policy.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#8BC34A] mt-1">•</span>
                              <span className="text-gray-700 leading-relaxed">{detail}</span>
                            </li>
                          ))}
                        {policy.conditions &&
                          policy.conditions.map((condition, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2
                                className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                  policy.icon === XCircle ? 'text-red-500' : 'text-[#8BC34A]'
                                }`}
                              />
                              <span className="text-gray-700 leading-relaxed">{condition}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Process Steps */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Return Process - Simple & Quick
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {returnSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-full flex items-center justify-center mb-4 shadow-lg relative z-10 hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-white">{step.step}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                    {index < returnSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] z-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Return Shipping Costs
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Free returns for defective or wrong items</li>
                  <li>• Customer pays shipping for size/fit exchanges</li>
                  <li>• Return shipping refunded if item is defective</li>
                  <li>• We provide prepaid return labels for eligible returns</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Keep original packaging and invoice</li>
                  <li>• Include all accessories and manuals</li>
                  <li>• Take photos if product is damaged</li>
                  <li>• Track your return shipment</li>
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/5 rounded-2xl p-8 border border-[#8BC34A]/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Need Help With Returns or Refunds?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6 text-center">
                Our customer support team is ready to assist you with any questions or concerns about cancellations,
                returns, or refunds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:riyanshamrit106@gmail.com"
                  className="px-8 py-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-center"
                >
                  Request Return via Email
                </a>
                <a
                  href="tel:+919370646279"
                  className="px-8 py-3 bg-white text-[#8BC34A] border-2 border-[#8BC34A] rounded-lg hover:bg-[#8BC34A] hover:text-white transition-all font-semibold text-center"
                >
                  Call Us: +91 9370646279
                </a>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:riyanshamrit106@gmail.com" className="text-[#8BC34A] hover:underline">
                    riyanshamrit106@gmail.com
                  </a>
                </p>
                <p className="text-gray-600 mt-2">
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

