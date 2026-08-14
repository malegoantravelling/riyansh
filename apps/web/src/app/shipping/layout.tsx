import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Shipping Policy',
  description:
    'Riyansh shipping timelines, free delivery above ₹500, and how we pack Ayurvedic juices and capsules for pan-India dispatch from Maharashtra.',
  path: '/shipping',
})

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return children
}
