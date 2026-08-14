'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'

const categories = [
  {
    title: 'Ayurvedic Juices & Tonics',
    href: '/store',
    image: '/image/riyansh_amrit_juice.png',
    tone: 'bg-jade/50',
  },
  {
    title: 'Capsules & Supplements',
    href: '/store',
    image: '/image/riyansh_artho_g.png',
    tone: 'bg-cotton',
  },
  {
    title: 'Personal Care & Herbal Oils',
    href: '/store',
    image: '/image/riyansh_lady_life.png',
    tone: 'bg-jade/40',
  },
  {
    title: 'Health & Nutrition',
    href: '/store',
    image: '/image/riyansh_daibo_g.png',
    tone: 'bg-cotton',
  },
]

export function HomeCategories() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-editorial">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <p className="eyebrow mb-3">Collections</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-evergreen sm:text-4xl lg:text-5xl">
              Shop by chapter
            </h2>
            <p className="mt-4 text-dusty-olive">
              Explore curated Ayurvedic categories — each one a quiet entry into daily wellness.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {categories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.08}>
              <Link
                href={cat.href}
                className={`group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[1.75rem] ${cat.tone} p-6 transition-shadow duration-500 hover:shadow-lift`}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 ease-premium group-hover:scale-105"
                  style={{ backgroundImage: `url(${cat.image})` }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-t from-evergreen/55 via-evergreen/10 to-transparent" />
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-medium text-cotton">{cat.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cotton/80 transition-all group-hover:gap-3">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
