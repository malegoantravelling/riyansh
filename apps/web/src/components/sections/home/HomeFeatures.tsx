'use client'

import Link from 'next/link'
import { Leaf, Shield, Clock, ArrowRight } from 'lucide-react'
import { SpotlightCard } from '@/components/aceternity/spotlight'
import { HoverTiltCard } from '@/components/aceternity/hover-tilt-card'
import { TextGenerateEffect } from '@/components/aceternity/text-generate'
import { BlurFade } from '@/components/magicui/blur-fade'

const features = [
  {
    icon: Leaf,
    title: 'Rooted in Ayurveda',
    body: 'Classical herbal formulas with botanicals chosen for daily immunity, digestion, and vitality. Care you take at home, not another clinical routine.',
  },
  {
    icon: Shield,
    title: '100% Genuine',
    body: 'All our medicines are sourced directly from certified manufacturers. Your health is our top priority.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    body: 'Our expert pharmacists are available round the clock to answer your questions and provide guidance.',
  },
]

export function HomeFeatures() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="container-editorial relative z-10">
        <BlurFade>
          <div className="mb-16 max-w-2xl">
            <p className="eyebrow mb-3">Why choose Riyansh</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-evergreen sm:text-4xl lg:text-5xl">
              <TextGenerateEffect words="Care that feels considered — not clinical noise." />
            </h2>
            <p className="mt-4 text-base text-dusty-olive sm:text-lg">
              Experience the difference with our commitment to quality, speed, and customer
              satisfaction.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {features.map((feature, i) => (
            <BlurFade key={feature.title} delay={0.12 * (i + 1)}>
              <HoverTiltCard className="h-full">
                <SpotlightCard className="glass-1 h-full rounded-3xl border-evergreen/10 p-0 shadow-none hover:shadow-lift">
                  <article className="relative flex h-full flex-col p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-display text-5xl font-medium text-evergreen/10">
                        0{i + 1}
                      </span>
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-evergreen text-white shadow-soft">
                        <feature.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="font-display text-2xl font-medium text-evergreen">
                      {feature.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-dusty-olive sm:text-base">
                      {feature.body}
                    </p>
                    <Link
                      href="/about"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-evergreen transition-all hover:gap-3"
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                </SpotlightCard>
              </HoverTiltCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
