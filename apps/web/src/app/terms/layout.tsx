import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Terms and Conditions',
  description:
    'Terms for buying Ayurvedic products on riyanshamrit.com: orders, accounts, acceptable use, and liability. Please read before you shop Riyansh Multitrade online.',
  path: '/terms',
})

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
