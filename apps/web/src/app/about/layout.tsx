import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'About Riyansh Ayurvedic Brand',
  description:
    'Riyansh Multitrade has made Ayurvedic juices and herbal supplements in Maharashtra since 2019. ISO 9001:2015 certified, with Amrit Juice, Artho-G, Daibo-G, and Lady Life Care.',
  path: '/about',
  image: '/image/ayurveda_hero_bg.png',
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
