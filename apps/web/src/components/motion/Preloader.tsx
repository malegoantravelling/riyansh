'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const SESSION_KEY = 'riyansh_preloader_seen'

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      if (typeof window === 'undefined') return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const seen = sessionStorage.getItem(SESSION_KEY) === '1'

      if (reduced || seen) {
        setDone(true)
        return
      }

      const root = rootRef.current
      if (!root) return

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          sessionStorage.setItem(SESSION_KEY, '1')
          setDone(true)
        },
      })

      tl.fromTo('.preloader-brand', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo(
          '.preloader-sub',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.35'
        )
        .fromTo(
          '.preloader-bar',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.85, ease: 'power2.inOut' },
          '-=0.2'
        )
        .to(root, { yPercent: -100, duration: 0.75, ease: 'power3.inOut', delay: 0.15 })
    },
    { scope: rootRef }
  )

  useEffect(() => {
    if (!done) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [done])

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-evergreen text-cotton"
      aria-hidden
    >
      <p className="preloader-brand font-display text-4xl font-medium tracking-tight sm:text-5xl">
        <span className="text-cotton">RIY</span>
        <span className="text-jade">ANSH</span>
      </p>
      <p className="preloader-sub mt-3 text-[11px] font-medium uppercase tracking-[0.28em] text-jade">
        Ayurvedic Wellness
      </p>
      <div className="preloader-bar mt-10 h-px w-32 origin-left bg-jade/60" />
    </div>
  )
}
