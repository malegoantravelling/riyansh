import Link from 'next/link'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EEEEEE] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              About <span className="text-[#8BC34A]">Pharmative</span>
            </h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eius quae reiciendis
              distinctio voluptates sed dolorum excepturi iure eaque, aut unde.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/store" className="text-[#666666] hover:text-[#8BC34A] text-sm">
                  Supplements
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-[#666666] hover:text-[#8BC34A] text-sm">
                  Vitamins
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-[#666666] hover:text-[#8BC34A] text-sm">
                  Diet & Nutrition
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-[#666666] hover:text-[#8BC34A] text-sm">
                  Tea & Coffee
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-[#8BC34A] mt-0.5 flex-shrink-0" />
                <span className="text-[#666666]">
                  Riyansh Ayurvedic Center, Mumbai, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-[#8BC34A] flex-shrink-0" />
                <span className="text-[#666666]">+91 9370646279</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-[#8BC34A] flex-shrink-0" />
                <span className="text-[#666666]">riyanshamrit106@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EEEEEE] mt-8 pt-8 text-center text-sm text-[#666666]">
          <p>
            Copyright © 2025 All rights reserved | This template is made with{' '}
            <Heart className="inline h-4 w-4 text-[#FF69B4]" /> by Colorlib
          </p>
        </div>
      </div>
    </footer>
  )
}
