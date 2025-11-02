'use client'

import { Truck, Clock, Package, MapPin, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function ShippingPage() {
  const shippingOptions = [
    {
      icon: Clock,
      title: 'Standard Shipping',
      duration: '7-9 Business Days',
      cost: 'Free on orders above ₹500',
      description: 'Standard ground shipping. Orders are processed within 1-2 business days.',
      features: [
        'Tracking information provided',
        'Package handling insurance',
        'Delivery confirmation required',
      ],
    },
    {
      icon: Truck,
      title: 'Express Shipping',
      duration: '4-6 Business Days',
      cost: '₹150 extra',
      description: 'Faster delivery for urgent orders. Additional charges apply.',
      features: ['Priority processing', 'Real-time tracking', 'Signature required'],
    },
  ]

  const shippingInfo = [
    {
      icon: Package,
      title: 'Processing Time',
      details: [
        'All orders are processed within 1-2 business days (excluding weekends and holidays)',
        'Orders placed after 2:00 PM IST will be processed the next business day',
        'During peak seasons, processing may take an additional 1-2 days',
        'You will receive an email confirmation once your order is shipped',
      ],
    },
    {
      icon: MapPin,
      title: 'Delivery Areas',
      details: [
        'We currently ship throughout India',
        'Major cities: 7-9 business days',
        'Rural areas and remote locations: 9-12 business days',
        'Some areas may require additional delivery time',
        'We use reliable shipping partners: BlueDart, India Post, and other trusted carriers',
      ],
    },
    {
      icon: AlertCircle,
      title: 'Important Information',
      details: [
        'Business days exclude weekends and national holidays',
        'Delivery times are estimates and may vary due to external factors',
        'Ensure someone is available to receive the package during business hours',
        'Track your order using the tracking number provided in your shipment email',
        'For fragile items, we use extra protective packaging',
      ],
    },
  ]

  const trackingSteps = [
    {
      step: '1',
      title: 'Order Confirmed',
      description: 'You receive email confirmation with order details',
    },
    {
      step: '2',
      title: 'Order Processing',
      description: 'We prepare your items for shipment (1-2 days)',
    },
    {
      step: '3',
      title: 'Order Shipped',
      description: 'Your order is dispatched with tracking number',
    },
    {
      step: '4',
      title: 'Out for Delivery',
      description: 'Your order arrives at local distribution center',
    },
    {
      step: '5',
      title: 'Delivered',
      description: 'Package delivered successfully!',
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
              <Truck className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Fast & Reliable Delivery</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
              Shipping Policy
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Get your products delivered safely and on time with our comprehensive shipping
              options.
            </p>

            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Link href="/" className="hover:text-white transition-colors cursor-pointer">
                Home
              </Link>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-white font-bold">Shipping Policy</span>
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
            {/* Shipping Options */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Choose Your Shipping Option
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {shippingOptions.map((option, index) => (
                  <div
                    key={index}
                    className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-[#8BC34A] transition-all duration-300 shadow-sm hover:shadow-xl group"
                  >
                    {index === 0 && (
                      <div className="absolute top-4 right-4 bg-[#8BC34A] text-white px-3 py-1 rounded-full text-xs font-bold">
                        RECOMMENDED
                      </div>
                    )}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <option.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{option.title}</h3>
                        <div className="flex items-center gap-2 text-[#8BC34A] font-bold">
                          <Clock className="h-5 w-5" />
                          <span className="text-xl">{option.duration}</span>
                        </div>
                        <p className="text-gray-600 mt-2 font-semibold">{option.cost}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{option.description}</p>
                    <ul className="space-y-2">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-[#8BC34A] flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Shipping Information
              </h2>
              <div className="space-y-8">
                {shippingInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 p-8 bg-white rounded-2xl border border-gray-200 hover:border-[#8BC34A] transition-all duration-300 shadow-sm"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-xl flex items-center justify-center">
                      <info.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900">{info.title}</h3>
                      <ul className="space-y-2">
                        {info.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#8BC34A] mt-1">•</span>
                            <span className="text-gray-700 leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Steps */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
                Track Your Order Journey
              </h2>
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-full flex items-center justify-center mb-4 shadow-lg relative z-10 group-hover:scale-110 transition-transform">
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] z-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Delivery Issues?
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you experience any delivery issues, please contact us immediately:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Email: riyanshamrit106@gmail.com</li>
                  <li>• Phone: +91 9370646279</li>
                  <li>• We respond within 24 hours</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Delivery Success Tips
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Provide accurate address details</li>
                  <li>• Include landmark references</li>
                  <li>• Keep your phone accessible</li>
                  <li>• Check tracking regularly</li>
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-[#8BC34A]/10 to-[#7CB342]/5 rounded-2xl p-8 border border-[#8BC34A]/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help With Shipping?</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our customer support team is here to help you with any shipping-related questions or
                concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:riyanshamrit106@gmail.com"
                  className="px-6 py-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-center"
                >
                  Email Us
                </a>
                <a
                  href="tel:+919370646279"
                  className="px-6 py-3 bg-white text-[#8BC34A] border-2 border-[#8BC34A] rounded-lg hover:bg-[#8BC34A] hover:text-white transition-all font-semibold text-center"
                >
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
