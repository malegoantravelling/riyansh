'use client'

import { Button } from '@/components/ui/button'
import {
  Heart,
  Leaf,
  Shield,
  Users,
  Sparkles,
  Award,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const values = [
    {
      icon: Leaf,
      title: 'Natural & Pure',
      description:
        'We source only the finest natural ingredients, ensuring purity and potency in every product.',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description:
        'All our products undergo rigorous testing to meet the highest standards of quality and safety.',
    },
    {
      icon: Heart,
      title: 'Health Focused',
      description:
        'Your wellbeing is our priority. We create products that truly make a difference in your health.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description:
        'We believe in building a community of health-conscious individuals supporting each other.',
    },
  ]

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Ayurvedic Consultant',
      image:
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%238BC34A"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="white"%3EDr. Priya%3C/text%3E%3C/svg%3E',
      description:
        'With over 15 years of experience in Ayurveda, Dr. Sharma leads our product development.',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Quality Control Manager',
      image:
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%237CB342"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="white"%3ERajesh%3C/text%3E%3C/svg%3E',
      description:
        'Ensures every product meets our stringent quality standards before reaching you.',
    },
    {
      name: 'Meera Patel',
      role: 'Customer Care Head',
      image:
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%238BC34A"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="white"%3EMeera%3C/text%3E%3C/svg%3E',
      description: 'Dedicated to providing exceptional customer service and support.',
    },
  ]

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
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-bold text-white">Our Story & Mission</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
              About Us
            </h1>

            <div className="flex items-center justify-center space-x-3 text-white/90">
              <Link href="/" className="hover:text-white transition-colors cursor-pointer">
                Home
              </Link>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
              <span className="text-white font-bold">About</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Hero Content Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#8BC34A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#7CB342]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-6 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BC34A]/10 rounded-full border border-[#8BC34A]/20">
                <CheckCircle2 className="h-4 w-4 text-[#8BC34A]" />
                <span className="text-sm font-semibold text-[#8BC34A]">Est. 2020</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-[#2d2d2d] leading-tight">
                Your Journey to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CB342]">
                  Natural Wellness
                </span>
              </h2>

              <div className="space-y-4">
                <p className="text-lg text-[#666666] leading-relaxed">
                  At Riyansh, we believe in the ancient wisdom of Ayurveda combined with modern
                  quality standards. Our mission is to bring you the purest, most effective natural
                  health products that have been trusted for centuries.
                </p>
                <p className="text-base text-[#666666] leading-relaxed">
                  Founded in 2020, we have been dedicated to sourcing the finest herbs and
                  ingredients from trusted suppliers across India. Every product is carefully
                  crafted to maintain its natural potency while meeting contemporary safety and
                  quality standards.
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#8BC34A]/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-[#8BC34A]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d2d2d] mb-1">100% Natural</h4>
                    <p className="text-sm text-[#666666]">Pure ingredients</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#8BC34A]/10 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-[#8BC34A]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d2d2d] mb-1">Certified Quality</h4>
                    <p className="text-sm text-[#666666]">Lab tested products</p>
                  </div>
                </div>
              </div>

              <Link href="/store">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#8BC34A] to-[#7CB342] hover:from-[#7CB342] hover:to-[#8BC34A] text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Explore Our Products
                  <ChevronDown className="h-5 w-5 ml-2 -rotate-90" />
                </Button>
              </Link>
            </div>

            {/* Enhanced Image Container */}
            <div className="relative group animate-fade-in">
              {/* Decorative Background */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#8BC34A]/20 to-[#7CB342]/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Main Image Container */}
              <div className="relative aspect-square bg-gradient-to-br from-[#A5D6A7] to-[#8BC34A] rounded-3xl p-8 overflow-hidden shadow-2xl">
                {/* Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Floating Badge */}
                <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#8BC34A]" />
                    <span className="text-sm font-bold text-[#2d2d2d]">Ayurvedic Products</span>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-full rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-700">
                  <Image
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='500' height='500' fill='%238BC34A'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='white'%3EAyurvedic Products%3C/text%3E%3C/svg%3E"
                    alt="Ayurvedic Products"
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                  />
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8BC34A]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Decorative Dots */}
                <div className="absolute bottom-6 right-6 flex gap-2">
                  <div className="w-3 h-3 bg-white/80 rounded-full" />
                  <div className="w-3 h-3 bg-white/60 rounded-full" />
                  <div className="w-3 h-3 bg-white/40 rounded-full" />
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-100 animate-float">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-[#8BC34A] mb-1">99%</div>
                  <div className="text-sm text-[#666666] font-medium">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Core Values Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#8BC34A]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#7CB342]/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BC34A]/10 rounded-full border border-[#8BC34A]/20 mb-4">
              <Heart className="h-4 w-4 text-[#8BC34A]" />
              <span className="text-sm font-semibold text-[#8BC34A]">What We Stand For</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2d2d2d]">Our Core Values</h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
              These principles guide everything we do, from product selection to customer service.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#8BC34A]/30 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background Glow on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#8BC34A]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8BC34A] to-[#7CB342] rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#2d2d2d] mb-3 group-hover:text-[#8BC34A] transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-[#666666] leading-relaxed text-sm">{value.description}</p>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(139, 195, 74, 0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#8BC34A]/30 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-[#8BC34A]" />
                </div>
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CB342] mb-3">
                  10,000+
                </div>
                <div className="text-[#666666] font-semibold text-sm">Happy Customers</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#8BC34A]/30 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="h-8 w-8 text-[#8BC34A]" />
                </div>
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CB342] mb-3">
                  500+
                </div>
                <div className="text-[#666666] font-semibold text-sm">Products</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#8BC34A]/30 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-[#8BC34A]" />
                </div>
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CB342] mb-3">
                  5+
                </div>
                <div className="text-[#666666] font-semibold text-sm">Years Experience</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#8BC34A]/30 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8BC34A]/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-[#8BC34A]" />
                </div>
                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8BC34A] to-[#7CB342] mb-3">
                  99%
                </div>
                <div className="text-[#666666] font-semibold text-sm">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#8BC34A]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#7CB342]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8BC34A]/10 rounded-full border border-[#8BC34A]/20 mb-4">
              <Users className="h-4 w-4 text-[#8BC34A]" />
              <span className="text-sm font-semibold text-[#8BC34A]">Expert Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2d2d2d]">Meet Our Team</h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">
              Our dedicated team of experts is committed to bringing you the best in natural health.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#8BC34A]/30 transform hover:-translate-y-3"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] rounded-t-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                <div className="relative">
                  {/* Avatar Container */}
                  <div className="relative inline-block mb-6">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/30 to-[#7CB342]/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Avatar */}
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 group-hover:border-[#8BC34A]/30 transition-all duration-500">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={144}
                        height={144}
                        className="object-cover w-full h-full"
                      />
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#8BC34A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#8BC34A] rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-[#2d2d2d] mb-2 group-hover:text-[#8BC34A] transition-colors duration-300">
                    {member.name}
                  </h3>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8BC34A]/10 rounded-full mb-4">
                    <span className="text-sm font-semibold text-[#8BC34A]">{member.role}</span>
                  </div>

                  <p className="text-[#666666] leading-relaxed text-sm">{member.description}</p>

                  {/* Social Links Placeholder */}
                  <div className="flex justify-center gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 bg-[#8BC34A]/10 rounded-full flex items-center justify-center hover:bg-[#8BC34A] hover:text-white transition-colors cursor-pointer">
                      <span className="text-xs font-bold">LI</span>
                    </div>
                    <div className="w-10 h-10 bg-[#8BC34A]/10 rounded-full flex items-center justify-center hover:bg-[#8BC34A] hover:text-white transition-colors cursor-pointer">
                      <span className="text-xs font-bold">✉</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Dotted Pattern */}
      <section className="relative py-24 bg-[#8BC34A] overflow-hidden">
        {/* Dotted Grid Pattern Background */}
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
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-bold text-white">Start Today</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Ready to Start Your{' '}
            <span className="relative inline-block">
              Wellness Journey?
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 10C50 5 150 5 298 10"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>
            </span>
          </h2>

          <p className="text-white text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have transformed their health with our natural
            products.
          </p>

          {/* Enhanced Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/store">
              <Button
                size="lg"
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-bold px-10 py-7 rounded-xl shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
              >
                <Leaf className="h-5 w-5 mr-2 text-white" />
                Shop Now
                <ChevronDown className="h-5 w-5 ml-2 -rotate-90 text-white" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white font-bold px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
              >
                <Users className="h-5 w-5 mr-2 text-white" />
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-extrabold text-white mb-1">10,000+</div>
              <div className="text-white/90 text-sm font-medium">Happy Customers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-extrabold text-white mb-1">500+</div>
              <div className="text-white/90 text-sm font-medium">Natural Products</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-extrabold text-white mb-1">99%</div>
              <div className="text-white/90 text-sm font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
