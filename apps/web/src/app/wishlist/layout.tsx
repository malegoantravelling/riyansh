import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Wishlist',
  description: 'Saved Ayurvedic products in your Riyansh wishlist.',
  path: '/wishlist',
  noIndex: true,
})

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
