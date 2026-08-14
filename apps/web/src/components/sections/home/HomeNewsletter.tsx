'use client'

import { Reveal } from '@/components/motion/Reveal'

export function HomeNewsletter() {
  return (
    <section className="relative overflow-hidden bg-transparent py-24 text-black lg:py-28">
      <div className="container-editorial relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-black/55">
              Stay connected
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl">
              Exclusive deals & wellness updates
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-black/70">
              Be the first to know about new formulations, seasonal offers, and care tips from
              Riyansh.
            </p>

            <form className="mx-auto mt-8 hidden max-w-md gap-2 sm:flex" aria-hidden>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                suppressHydrationWarning
                className="flex-1 rounded-full border border-black/15 bg-white/80 px-5 py-3 text-sm text-black placeholder:text-black/40 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/80"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-black/50">
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
