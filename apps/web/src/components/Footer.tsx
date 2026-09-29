import Link from 'next/link'
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Shield,
  Award,
  Sparkles,
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-auto overflow-hidden bg-charcoal text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-forest/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brass/20 blur-3xl" />
      </div>

      <div className="relative z-10 container-editorial pt-20 pb-10">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow text-sage mb-4">Riyansh Multitrade</p>
          <h2 className="font-display text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            Wellness, delivered with quiet confidence.
          </h2>
        </div>

        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-semibold">
                <span className="text-white">RIY</span>
                <span className="text-forest-soft">ANSH</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Authentic Ayurvedic juices and herbal supplements from Maharashtra — immunity,
                joints, digestion, and women’s wellness, delivered across India.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Shield className="h-3.5 w-3.5 text-forest-soft" />
                <span className="text-[11px] font-medium tracking-wide">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Award className="h-3.5 w-3.5 text-forest-soft" />
                <span className="text-[11px] font-medium tracking-wide">Certified</span>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Follow Us
              </h4>
              <div className="flex gap-2">
                {[
                  { icon: Facebook, href: '#', label: 'Facebook' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Youtube, href: '#', label: 'YouTube' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:border-forest-soft hover:bg-forest"
                  >
                    <social.icon className="h-4 w-4 text-white/60" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-display text-lg font-medium">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/store', label: 'Shop' },
                { href: '/wellness', label: 'Wellness guides' },
                { href: '/wellness/immunity', label: 'Immunity' },
                { href: '/wellness/joint-pain', label: 'Joint care' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'E-Consultation' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-white/55 transition-colors hover:text-forest-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-display text-lg font-medium">Customer Service</h3>
            <ul className="space-y-3">
              {[
                { href: '/shipping', label: 'Shipping Policy' },
                { href: '/cancellation-refund', label: 'Returns & Refunds' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/contact', label: 'Support Center' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-white/55 transition-colors hover:text-forest-soft"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-4 font-display text-lg font-medium">Online Support</h3>
              <p className="text-sm leading-relaxed text-white/55 mb-4">
                Have questions or need consultation? Reach out through our dedicated online assistance portal.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-forest-soft/30 bg-forest/20 px-4 py-2 text-xs font-semibold text-forest-soft transition-colors hover:bg-forest/40"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Contact Online Support</span>
              </Link>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                Subscribe Newsletter
              </h4>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  autoComplete="email"
                  suppressHydrationWarning
                  className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/35 focus:border-forest-soft focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1 bottom-1 flex items-center justify-center rounded-full bg-forest px-3 transition-opacity hover:opacity-90"
                  aria-label="Subscribe"
                  suppressHydrationWarning
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-sm text-white/40 md:text-left">
            © {currentYear} <span className="font-medium text-forest-soft">Riyansh</span>
            {' · '}
            <a
              href="https://mahendranagpure.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest-soft"
            >
              mahendranagpure.com
            </a>
            {' · '}
            <a
              href="https://jayeshbpatil.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest-soft"
            >
              jayeshbpatil.com
            </a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-forest-soft">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-forest-soft">
              Terms
            </Link>
            <Link href="/shipping" className="hover:text-forest-soft">
              Shipping
            </Link>
            <Link href="/cancellation-refund" className="hover:text-forest-soft">
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
