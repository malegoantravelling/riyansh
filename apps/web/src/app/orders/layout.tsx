import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Orders',
  description: 'Riyansh order status pages are private and not indexed.',
  path: '/orders',
  noIndex: true,
})

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children
}
