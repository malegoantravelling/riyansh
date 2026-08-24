'use client'

import { cn } from '@/lib/utils'

type BackgroundBeamsProps = {
  className?: string
}

/** Soft evergreen beam grid for hero/about — CSS only, no Three.js */
export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(193,195,172,0.35),_transparent_55%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="riyansh-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#013220" stopOpacity="0" />
            <stop offset="50%" stopColor="#013220" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#80866e" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1={`${i * 14}%`}
            y1="0%"
            x2={`${i * 14 + 28}%`}
            y2="100%"
            stroke="url(#riyansh-beam)"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  )
}
