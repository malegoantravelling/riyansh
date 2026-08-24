'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { cn } from '@/lib/utils'

type NumberTickerProps = {
  value: number
  className?: string
  suffix?: string
  duration?: number
}

/** Magic UI–style number ticker for about stats */
export function NumberTicker({ value, className, suffix = '', duration = 1400 }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(value)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}
