import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Contact Riyansh Ayurveda',
  description:
    'Email, call, or write to Riyansh Multitrade in Sangamner, Maharashtra. Product questions, orders, and Ayurvedic wellness guidance — we reply within one working day where possible.',
  path: '/contact',
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
