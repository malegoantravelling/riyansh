'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { Spotlight } from '@/components/aceternity/spotlight'
import { ArrowDown, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Flagship hero — product photography + editorial type.
 * Clean left column: brand, headline, one line of copy, two CTAs.
 */
export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.preload = 'auto'
    void video.play().catch(() => {
      /* autoplay can be blocked; muted + playsInline should usually allow it */
    })
  }, [])

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!sectionRef.current) return

      if (reduced) {
        gsap.set(
          ['.hero-media-inner', '.hero-veil', '.hero-eyebrow', '.hero-line', '.hero-copy', '.hero-cta', '.hero-scroll'],
          { clearProps: 'all', opacity: 1, y: 0, scale: 1, clipPath: 'none' }
        )
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('.hero-media-inner', { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo('.hero-veil', { opacity: 0 }, { opacity: 1, duration: 1 }, 0.15)
        .fromTo('.hero-eyebrow', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.4)
        .fromTo(
          '.hero-line',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
          0.5
        )
        .fromTo('.hero-copy', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.4')
        .fromTo(
          '.hero-cta > *',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          '-=0.35'
        )
        .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.45 }, '-=0.15')

      if (mediaWrapRef.current) {
        gsap.to('.hero-still-parallax', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    },
    { scope: sectionRef }
  )

  const scrollNext = () => {
    const next = sectionRef.current?.nextElementSibling
    next?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100svh-4.5rem)] overflow-hidden bg-transparent"
      data-cursor="image"
      aria-label="Riyansh hero"
    >
      <div ref={mediaWrapRef} className="absolute inset-0 overflow-hidden">
        <div className="hero-media-inner absolute inset-0">
          <video
            ref={videoRef}
            className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-right md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/video/riyansh_amrit_hero.mp4?v=2k" type="video/mp4" />
          </video>

          <div className="hero-still-parallax absolute inset-0 md:hidden">
            <Image
              src="/image/riyansh_amrit_hero_mobile.png"
              alt="Riyansh Amrit Juice"
              fill
              priority
              sizes="100vw"
              quality={90}
              className="object-cover object-[72%_center]"
            />
          </div>
        </div>

        <div className="hero-veil pointer-events-none absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-white via-white/90 to-transparent md:w-[56%] lg:w-[50%]" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white/75 to-transparent md:hidden" />
        </div>
        <Spotlight className="z-[1]" fill="rgba(1, 50, 32, 0.08)" />
      </div>

      <div className="container-editorial relative z-10 flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-20 lg:py-24 md:ml-[7%]">
        <div className="max-w-xl lg:max-w-[34rem]">
          <p className="hero-eyebrow mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-dusty-olive">
            Trusted healthcare partner
          </p>

          <div className="hero-title mb-5 space-y-0.5">
            <div className="overflow-hidden">
              <p className="hero-line font-display text-xs tracking-[0.24em] text-evergreen/65 uppercase sm:text-sm">
                Riyansh
              </p>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-line font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight text-evergreen sm:text-5xl lg:text-[3.75rem]">
                Your health,
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-line font-display text-[2.6rem] font-medium italic leading-[1.05] tracking-tight text-dusty-olive sm:text-5xl lg:text-[3.75rem]">
                our craft.
              </h1>
            </div>
          </div>

          <p className="hero-copy mb-8 max-w-md text-[15px] leading-relaxed text-dusty-olive sm:text-base">
            Premium Ayurvedic formulations — genuine, considered, and delivered with care.
          </p>

          <div className="hero-cta flex flex-wrap items-center gap-3">
            <Link href="/store">
              <ShimmerButton size="lg" className="rounded-full px-8 shadow-lift">
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </ShimmerButton>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-evergreen/25 bg-white px-8 text-evergreen hover:bg-evergreen hover:text-white"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollNext}
          className="hero-scroll mt-16 inline-flex items-center gap-2 self-start text-[10px] font-medium uppercase tracking-[0.28em] text-dusty-olive transition-colors hover:text-evergreen"
          aria-label="Scroll to next section"
        >
          <ArrowDown className="h-3.5 w-3.5" />
          Scroll
        </button>
      </div>
    </section>
  )
}
