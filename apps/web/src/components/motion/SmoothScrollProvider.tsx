'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const COMMERCE_PREFIXES = ['/checkout', '/auth', '/login', '/signup']

function shouldDisableSmoothScroll(pathname: string) {
  return COMMERCE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const disabled = reduced || shouldDisableSmoothScroll(pathname)

    if (disabled) {
      lenisRef.current?.destroy()
      lenisRef.current = null
      document.documentElement.classList.remove('lenis')
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    lenisRef.current = lenis
    document.documentElement.classList.add('lenis')

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      lenisRef.current = null
      document.documentElement.classList.remove('lenis')
    }
  }, [pathname])

  return <>{children}</>
}
