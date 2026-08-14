import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Account',
  description: 'Manage your Riyansh account and orders.',
  path: '/account',
  noIndex: true,
})

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
