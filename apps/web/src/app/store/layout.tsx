import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Shop Ayurvedic Supplements',
  description:
    'Browse Riyansh Ayurvedic juices, capsules, and herbal health supplements for immunity, joints, digestion, stamina, and women’s wellness. Genuine products, shipped across India.',
  path: '/store',
})

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return children
}
