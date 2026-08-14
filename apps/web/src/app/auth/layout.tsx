import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Authentication',
  description: 'Riyansh sign-in callback.',
  path: '/auth',
  noIndex: true,
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children
}
