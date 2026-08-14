import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Shopping Cart',
  description: 'Review Ayurvedic products in your Riyansh cart before checkout.',
  path: '/cart',
  noIndex: true,
})

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
