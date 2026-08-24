'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SKIP_PREFIXES = ['/checkout', '/auth']

/**
 * Subtle opacity entrance on route change for marketing pages.
 * Skips checkout/auth to avoid interfering with payment/OAuth.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const skip = SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    if (skip) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const main = document.querySelector('main')
    if (!main) return

    main.animate([{ opacity: 0.72 }, { opacity: 1 }], {
      duration: 280,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    })
  }, [pathname])

  return <>{children}</>
}
