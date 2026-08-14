import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How Riyansh collects, uses, and protects personal data for orders, accounts, and support. Read your rights and how to contact us about privacy at riyanshamrit.com.',
  path: '/privacy',
})

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
