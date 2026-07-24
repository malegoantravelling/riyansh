import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Shield,
  Award,
  Clock,
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-[#1A1A1A] via-[#111111] to-[#1A1A1A] text-white mt-auto relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#5B8C51] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5B8C51] rounded-full blur-3xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-6 text-center md:text-left">
            <div>
              <h3 className="text-3xl font-extrabold mb-2">
                <span className="text-white">RIY</span>
                <span className="text-[#5B8C51]">ANSH</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted partner for premium quality healthcare products. We deliver wellness to
                your doorstep.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                <Shield className="h-4 w-4 text-[#5B8C51]" />
                <span className="text-xs font-semibold">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                <Award className="h-4 w-4 text-[#5B8C51]" />
                <span className="text-xs font-semibold">Certified</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-gray-300">Follow Us</h4>
              <div className="flex gap-3 justify-center md:justify-start">
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
                    className="w-10 h-10 bg-white/5 hover:bg-[#5B8C51] border border-white/10 hover:border-[#5B8C51] rounded-full flex items-center justify-center transition-all duration-300 group"
                  >
                    <social.icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {[
                { href: '/', label: 'Home' },
                { href: '/store', label: 'Shop' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#5B8C51] text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#5B8C51] group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-6 text-white">Customer Service</h3>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
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
                    className="text-gray-400 hover:text-[#5B8C51] text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#5B8C51] group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-6 text-white">Contact Us</h3>
              <ul className="space-y-4 flex flex-col items-center md:items-start">
                <li className="flex items-start gap-3 text-sm group w-full md:w-auto justify-center md:justify-start">
                  <div className="p-2 bg-[#5B8C51]/10 rounded-lg group-hover:bg-[#5B8C51] transition-colors">
                    <MapPin className="h-4 w-4 text-[#5B8C51] group-hover:text-white" />
                  </div>
                  <span className="text-gray-400 leading-relaxed flex-1">
                    Jijamata Pride, Sangamner / Malegaon, Maharashtra, 422608, India
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm group justify-center md:justify-start">
                  <div className="p-2 bg-[#5B8C51]/10 rounded-lg group-hover:bg-[#5B8C51] transition-colors">
                    <Phone className="h-4 w-4 text-[#5B8C51] group-hover:text-white" />
                  </div>
                  <a
                    href="tel:+918605911293"
                    className="text-gray-400 hover:text-[#5B8C51] transition-colors"
                  >
                    +91 8605911293
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm group justify-center md:justify-start">
                  <div className="p-2 bg-[#5B8C51]/10 rounded-lg group-hover:bg-[#5B8C51] transition-colors">
                    <Mail className="h-4 w-4 text-[#5B8C51] group-hover:text-white" />
                  </div>
                  <a
                    href="mailto:riyanshamrit106@gmail.com"
                    className="text-gray-400 hover:text-[#5B8C51] transition-colors break-all"
                  >
                    riyanshamrit106@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm justify-center md:justify-start">
                  <div className="p-2 bg-[#5B8C51]/10 rounded-lg">
                    <Clock className="h-4 w-4 text-[#5B8C51]" />
                  </div>
                  <span className="text-gray-400">Mon - Sat: 9:00 AM - 8:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-gray-300">Subscribe Newsletter</h4>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#5B8C51] transition-colors"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-[#5B8C51] to-[#4E7A45] rounded-lg hover:opacity-90 transition-opacity">
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {currentYear} <span className="text-[#5B8C51] font-semibold">Riyansh</span> Made with{' '}
              <Heart className="inline h-3 w-3 text-red-500 animate-pulse" /> for your wellness
              {' · '}
              <a
                href="https://mahendranagpure.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5B8C51] transition-colors"
              >
                mahendranagpure.com
              </a>
              {' · '}
              <a
                href="https://jayeshbpatil.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5B8C51] transition-colors"
              >
                jayeshbpatil.com
              </a>
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500 flex-wrap justify-center">
              <Link href="/privacy" className="hover:text-[#5B8C51] transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#5B8C51] transition-colors">
                Terms & Conditions
              </Link>
              <span>•</span>
              <Link href="/shipping" className="hover:text-[#5B8C51] transition-colors">
                Shipping Policy
              </Link>
              <span>•</span>
              <Link href="/cancellation-refund" className="hover:text-[#5B8C51] transition-colors">
                Returns & Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
