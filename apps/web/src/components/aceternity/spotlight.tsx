'use client'

import { useRef, useState, useEffect, type MouseEvent, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SpotlightProps = {
  className?: string
  fill?: string
}

/** Aceternity-style mouse spotlight overlay — Riyansh themed */
export function Spotlight({ className, fill = 'rgba(1, 50, 32, 0.12)' }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 40 })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const el = ref.current?.parentElement
    if (!el) return

    const onMove = (e: globalThis.MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      style={{
        background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, ${fill}, transparent 55%)`,
      }}
    />
  )
}

type SpotlightCardProps = {
  children: ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>

export function SpotlightCard({ children, className, onMouseMove, ...props }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`)
    onMouseMove?.(e)
  }

  return (
    <div
      ref={ref}
      {...props}
      onMouseMove={handleMove}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-evergreen/10 bg-white shadow-soft transition-shadow hover:shadow-lift',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(193, 195, 172, 0.45), transparent 60%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
