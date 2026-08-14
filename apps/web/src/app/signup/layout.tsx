import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Create Account',
  description: 'Create a Riyansh account to order Ayurvedic supplements online.',
  path: '/signup',
  noIndex: true,
})

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
