'use client'

import { useRef, type MouseEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type HoverTiltCardProps = {
  children: ReactNode
  className?: string
}

/** Light 3D tilt + glow — Aceternity card pattern, CSS/transform only */
export function HoverTiltCard({ children, className }: HoverTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotX = (0.5 - y) * 8
    const rotY = (x - 0.5) * 8
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`
  }

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'relative transition-transform duration-200 ease-out will-change-transform',
        className
      )}
    >
      {children}
    </div>
  )
}
