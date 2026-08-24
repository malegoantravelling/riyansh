import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { WellnessHub } from '@/components/sections/wellness/WellnessHub'

export const metadata: Metadata = pageMetadata({
  title: 'Ayurvedic Wellness Guides',
  description:
    'Plain-language Ayurvedic guides from Riyansh: immunity syrups and tablets, joint comfort, digestion, women’s health tonics, and hair or skin support from within.',
  path: '/wellness',
})

export default function WellnessIndexPage() {
  return <WellnessHub />
}
