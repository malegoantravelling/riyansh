'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const MUTED_PREFIXES = ['/checkout', '/auth']

/**
 * Fixed soft botanical washes behind the whole app.
 * Muted on checkout/auth so forms stay crisp.
 */
export function PageAtmosphere() {
  const pathname = usePathname()
  const muted = MUTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 z-0 overflow-hidden',
        muted ? 'opacity-40' : 'opacity-100'
      )}
    >
      <div className="glow-orb -right-24 top-[-8%] h-[28rem] w-[28rem] bg-[rgba(193,195,172,0.45)]" />
      <div className="glow-orb right-[-8%] top-[22%] h-[22rem] w-[22rem] bg-[rgba(1,50,32,0.08)]" />
      <div className="glow-orb bottom-[-8%] right-[18%] h-[26rem] w-[26rem] bg-[rgba(128,134,110,0.18)]" />
      <div className="glow-orb left-[8%] bottom-[10%] h-56 w-56 bg-[rgba(193,195,172,0.18)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(1,50,32,0.45) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />
    </div>
  )
}
