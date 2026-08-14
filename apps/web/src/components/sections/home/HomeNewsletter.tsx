'use client'

import { Reveal } from '@/components/motion/Reveal'

export function HomeNewsletter() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(145deg,#012418_0%,#013220_42%,#024a30_72%,#80866e_100%)] py-24 text-white lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(193,195,172,0.28),_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-jade/20 blur-3xl"
      />
      <div className="container-editorial relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-jade">
              Stay connected
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
              Exclusive deals & wellness updates
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/75">
              Be the first to know about new formulations, seasonal offers, and care tips from
              Riyansh.
            </p>

            <form className="mx-auto mt-8 hidden max-w-md gap-2 sm:flex" aria-hidden>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                suppressHydrationWarning
                className="flex-1 rounded-full border border-white/20 bg-white/95 px-5 py-3 text-sm text-evergreen placeholder:text-dusty-olive focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-evergreen transition-colors hover:bg-jade"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <span>Secure</span>
              <span>No spam</span>
              <span>Community updates</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
