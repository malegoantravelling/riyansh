'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/motion/Reveal'
import { ArrowRight } from 'lucide-react'

export function HomePhilosophy() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-evergreen" />
      <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-jade/20 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-cotton/10 blur-3xl" />

      <div className="container-editorial relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-jade">
              Brand philosophy
            </p>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-cotton sm:text-4xl lg:text-5xl">
              Heritage formulas. Modern care. Quiet confidence.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cotton/70">
              Riyansh Multitrade brings authentic Ayurvedic craftsmanship into everyday life —
              genuine products, human support, and a digital experience as considered as the
              formulations themselves.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link href="/about">
                <Button
                  size="lg"
                  className="rounded-full bg-cotton text-evergreen hover:bg-jade hover:text-evergreen"
                >
                  Our Story
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/store">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-cotton/30 text-cotton hover:bg-cotton hover:text-evergreen"
                >
                  Shop Collection
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
