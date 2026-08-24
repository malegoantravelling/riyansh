'use client'

import { cn } from '@/lib/utils'

type MarqueeProps = {
  children: React.ReactNode
  className?: string
  pauseOnHover?: boolean
  reverse?: boolean
}

/** Magic UI–style infinite marquee */
export function Marquee({ children, className, pauseOnHover = false, reverse }: MarqueeProps) {
  return (
    <div
      className={cn(
        'group flex w-full overflow-hidden [--duration:40s] [--gap:1.75rem] [gap:var(--gap)]',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-stretch gap-[var(--gap)] animate-marquee will-change-transform',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'flex shrink-0 items-stretch gap-[var(--gap)] animate-marquee will-change-transform',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
    </div>
  )
}
