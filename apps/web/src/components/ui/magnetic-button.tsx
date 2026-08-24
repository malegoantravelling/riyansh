'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number
  asChild?: boolean
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, children, strength = 0.35, onMouseMove, onMouseLeave, ...props }, ref) => {
    const innerRef = React.useRef<HTMLButtonElement | null>(null)
    const [reduced, setReduced] = React.useState(false)

    React.useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduced(mq.matches)
      const onChange = () => setReduced(mq.matches)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }, [])

    const setRefs = (node: HTMLButtonElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseMove?.(e)
      if (reduced || !innerRef.current) return
      const rect = innerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      innerRef.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }

    const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseLeave?.(e)
      if (!innerRef.current) return
      innerRef.current.style.transform = 'translate(0, 0)'
    }

    return (
      <button
        ref={setRefs}
        className={cn(
          'relative inline-flex items-center justify-center transition-transform duration-normal ease-premium will-change-transform',
          className
        )}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        {...props}
      >
        {children}
      </button>
    )
  }
)
MagneticButton.displayName = 'MagneticButton'

export { MagneticButton }
