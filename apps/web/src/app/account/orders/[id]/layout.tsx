import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Order details',
  description: 'View your Riyansh order details.',
  path: '/account/orders',
  noIndex: true,
})

export default function OrderDetailLayout({ children }: { children: ReactNode }) {
  return children
}
