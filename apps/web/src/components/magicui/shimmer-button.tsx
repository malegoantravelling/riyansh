'use client'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'

type ShimmerButtonProps = ButtonProps & {
  shimmerClassName?: string
}

/** Magic UI–style shimmer CTA wrapper around themed Button */
export function ShimmerButton({
  className,
  shimmerClassName,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <Button
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer',
          shimmerClassName
        )}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Button>
  )
}
