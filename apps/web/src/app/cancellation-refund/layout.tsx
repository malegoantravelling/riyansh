import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Cancellation and Refunds',
  description:
    'Riyansh cancellation, return, and refund rules for unopened Ayurvedic products. Learn timelines, eligible orders, and how to contact support for a return.',
  path: '/cancellation-refund',
})

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return children
}
