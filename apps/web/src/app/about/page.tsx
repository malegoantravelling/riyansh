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
  ChevronRight,
  Factory,
  MapPin,
  FlaskConical,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const products = [
  {
    name: 'Riyansh Amrit Juice',
    tagline: '42-Herb Wellness Drink',
    description:
      'Our flagship Ayurvedic juice blends around 42 traditional herbs and botanicals — including Ashwagandha, Amla, Aloe Vera, Brahmi, and antioxidant-rich berries — formulated to support daily immunity, digestion, and vitality.',
    image: '/image/riyansh_amrit_juice.png',
    slug: 'riyansh-amrit-juice',
  },
  {
    name: 'Riyansh Artho-G',
    tagline: 'Joint & Mobility Care',
    description:
      'A specialized herbal formulation crafted to support joint comfort, flexibility, and bone wellness — ideal for an active lifestyle and everyday musculoskeletal care.',
    image: '/image/riyansh_artho_g.png',
    slug: 'riyansh-artho-g',
  },
  {
    name: 'Riyansh Daibo-G',
    tagline: 'Metabolic & Sugar Care',
    description:
      'An Ayurvedic care formula designed to support healthy blood sugar balance and metabolic wellness as part of a balanced diet and lifestyle.',
    image: '/image/riyansh_daibo_g.png',
    slug: 'riyansh-daibo-g',
  },
  {
    name: 'Riyansh Lady Life Care',
    tagline: 'Women’s Wellness',
    description:
      'A women-focused Ayurvedic formulation for hormonal balance, vitality, and everyday feminine wellness support.',
    image: '/image/riyansh_lady_life.png',
    slug: 'riyansh-lady-life-care',
  },
]

const values = [
  {
    icon: Leaf,
    title: 'Rooted in Ayurveda',
    description:
      'Formulas inspired by classical Indian herbal wisdom, using carefully selected botanicals for modern daily wellness.',
  },
  {
    icon: FlaskConical,
    title: 'Quality First',
    description:
      'Manufactured with attention to purity and consistency. Riyansh Multitrade is an ISO 9001:2015 certified company.',
  },
  {
    icon: Heart,
    title: 'Health & Happiness',
    description:
      'Our motto is spreading wealth through commitment to health and happiness — for customers and partners alike.',
  },
  {
    icon: Users,
    title: 'Pan-India Reach',
    description:
      'Online and offline presence with a growing distributor network across India, bringing wellness closer to every home.',
  },
]

const milestones = [
  { icon: Factory, label: 'Founded', value: '2019' },
  { icon: Award, label: 'Certification', value: 'ISO 9001:2015' },
  { icon: MapPin, label: 'Base', value: 'Maharashtra, India' },
  { icon: Truck, label: 'Reach', value: 'Pan-India' },
]

export default function AboutPage() {
  return (
    <div className="bg-[#FAFBF8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#4E7A45]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(165,214,167,0.25),transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white tracking-wide">
                Riyansh Multitrade Pvt. Ltd.
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Ayurveda for Everyday
              <span className="block text-[#D4E8C8]">Health & Happiness</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mb-8">
              Since 2019, Riyansh has been crafting authentic Ayurvedic wellness products — from our
              iconic 42-herb Amrit Juice to specialized care for joints, metabolism, and women’s
              health — delivered with modern quality standards.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/85">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 opacity-70" />
              <span className="font-semibold text-white">About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5B8C51]">
                Who We Are
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] leading-tight">
                Built in Maharashtra.
                <span className="text-[#4E7A45]"> Trusted across India.</span>
              </h2>
              <div className="space-y-4 text-[#555555] leading-relaxed text-base md:text-lg">
                <p>
                  <strong className="text-[#1A1A1A]">Riyansh Amrit</strong> is marketed by{' '}
                  <strong className="text-[#1A1A1A]">Riyansh Multitrade Private Limited</strong>, an
                  Ayurvedic wellness company that began operations in{' '}
                  <strong className="text-[#1A1A1A]">2019</strong>. Headquartered in the Sangamner /
                  Ahmednagar region of Maharashtra, we manufacture and trade herbal juices,
                  capsules, and specialized care formulations for families across India.
                </p>
                <p>
                  Under visionary leadership, Riyansh grew from a focused health-product venture
                  into a pan-India brand with online and offline sales centres and an expanding
                  distributor network. We are an{' '}
                  <strong className="text-[#1A1A1A]">ISO 9001:2015</strong> certified organisation,
                  committed to world-class service and consistent product quality.
                </p>
                <p>
                  Our belief is simple:{' '}
                  <em className="text-[#4E7A45] not-italic font-semibold">
                    Har Ghar Sehat, Har Ghar Rozgar
                  </em>{' '}
                  — healthier homes and opportunity through authentic Ayurvedic products and a
                  sustainable business community.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {milestones.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-2xl border border-[#E8EFE4] bg-[#FAFBF8] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5B8C51]/10">
                      <Icon className="h-5 w-5 text-[#5B8C51]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#888888]">
                        {label}
                      </p>
                      <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border-[8px] border-[#C8E0C0] shadow-xl">
                <div className="relative aspect-[4/5] sm:aspect-square bg-[#EAF4E6]">
                  <Image
                    src="/image/ayurveda_hero_bg.png"
                    alt="Riyansh Ayurvedic wellness"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
              <div className="absolute -bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-64 rounded-2xl bg-white shadow-xl border border-[#E8EFE4] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5B8C51]/10">
                    <Shield className="h-6 w-6 text-[#5B8C51]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">ISO 9001:2015</p>
                    <p className="text-xs text-[#666666]">Certified quality systems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / values */}
      <section className="py-16 md:py-20 bg-[#F3F7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5B8C51] mb-3">
              Our Promise
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-4">
              Why families choose Riyansh
            </h2>
            <p className="text-[#666666] text-lg leading-relaxed">
              We combine traditional herbal knowledge with disciplined manufacturing — so every
              bottle and capsule supports everyday wellness you can trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-[#E5EDE1] p-6 hover:border-[#5B8C51]/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B8C51]/10">
                  <Icon className="h-6 w-6 text-[#5B8C51]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product range */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5B8C51] mb-3">
                Our Range
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-4">
                Signature Riyansh products
              </h2>
              <p className="text-[#666666] text-lg leading-relaxed">
                From daily immunity tonic to targeted care formulas — each product is developed for
                real-life wellness needs of Indian families.
              </p>
            </div>
            <Link href="/store">
              <Button className="bg-[#4E7A45] hover:bg-[#3f6638] text-white font-semibold rounded-full px-6">
                View all products
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-5 rounded-3xl border border-[#E8EFE4] bg-[#FAFBF8] p-5 sm:p-6 hover:border-[#5B8C51] hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mx-auto sm:mx-0 h-44 w-44 sm:h-full sm:w-full sm:min-h-[160px] rounded-2xl bg-white border border-[#EEF3EA] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    sizes="180px"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#5B8C51] mb-1">
                    {product.tagline}
                  </p>
                  <h3 className="text-xl font-extrabold text-[#1A1A1A] mb-2 group-hover:text-[#4E7A45] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <span className="inline-flex items-center text-sm font-semibold text-[#4E7A45]">
                    Learn more
                    <ChevronRight className="h-4 w-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quality strip */}
      <section className="py-14 bg-[#4E7A45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <CheckCircle2 className="h-8 w-8 text-[#D4E8C8] shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Herbal formulations</h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  Crafted from traditional herbs and botanicals for supportive daily wellness — not
                  a substitute for medical advice.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <Award className="h-8 w-8 text-[#D4E8C8] shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Certified company</h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  ISO 9001:2015 certified operations with a focus on consistent quality and customer
                  service standards.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <Truck className="h-8 w-8 text-[#D4E8C8] shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Delivered to your door</h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  Order online with free shipping on eligible orders above ₹500 — genuine products
                  packaged with care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, value: '5,000+', label: 'Happy Customers' },
              { icon: Leaf, value: '42+', label: 'Herbs in Amrit Juice' },
              { icon: Award, value: 'Since 2019', label: 'Years of Trust' },
              { icon: MapPin, value: 'Pan-India', label: 'Distribution Reach' },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#E8EFE4] bg-[#FAFBF8] p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5B8C51]/10">
                  <Icon className="h-6 w-6 text-[#5B8C51]" />
                </div>
                <p className="text-2xl md:text-3xl font-extrabold text-[#4E7A45] mb-1">{value}</p>
                <p className="text-sm font-medium text-[#666666]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden bg-[#5B8C51]">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 mb-6">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">Start your wellness journey</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Experience authentic Riyansh Ayurveda
          </h2>
          <p className="text-white/90 text-lg mb-10 leading-relaxed">
            Explore our flagship Amrit Juice and specialized care range — genuine products, careful
            packaging, and support when you need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store">
              <Button
                size="lg"
                className="bg-[#3f6638] hover:bg-[#355530] text-white border-2 border-white/70 font-bold px-8 py-6 rounded-full text-base"
              >
                Shop Products
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/15 hover:text-white font-bold px-8 py-6 rounded-full text-base"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
