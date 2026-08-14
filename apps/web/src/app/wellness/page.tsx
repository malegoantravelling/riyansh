import Link from 'next/link'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Ayurvedic Wellness Guides',
  description:
    'Plain-language Ayurvedic guides from Riyansh: immunity syrups and tablets, joint comfort, digestion, women’s health tonics, and hair or skin support from within.',
  path: '/wellness',
})

const guides = [
  {
    href: '/wellness/immunity',
    title: 'Immunity syrups and tablets',
    summary:
      'When a daily herbal tonic makes sense versus capsules, and how Amrit Juice fits an Indian household routine.',
  },
  {
    href: '/wellness/joint-pain',
    title: 'Joint comfort and herbal oils',
    summary:
      'How topical oils differ from internal formulas such as Artho-G, and what “Indian herbs for joint pain” usually means.',
  },
  {
    href: '/wellness/digestive-health',
    title: 'Gas, acidity, and digestion',
    summary:
      'A calm look at Ayurvedic digestive care — diet first, then supportive tonics — without miracle claims.',
  },
  {
    href: '/wellness/womens-health',
    title: 'Women’s health tonics',
    summary:
      'What a women’s Ayurvedic tonic is for, who should pause before using one, and where Lady Life Care sits.',
  },
  {
    href: '/wellness/hair-and-skin',
    title: 'Hair and skin from within',
    summary:
      'Honest notes on hair-fall and oily-skin searches: we do not sell oils or soaps, but several herbs overlap.',
  },
]

export default function WellnessIndexPage() {
  return (
    <div className="bg-white">
      <header className="bg-[#4E7A45] text-white py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-semibold tracking-[0.16em] uppercase text-white/80 mb-3">
            Learn before you buy
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Ayurvedic wellness guides
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Short, practical articles written around real shopper questions — immunity, joints,
            digestion, women’s health, hair, and skin — without stuffing the same phrase on every
            line.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <ul className="space-y-5">
          {guides.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="block rounded-2xl border border-[#E8EFE4] p-6 hover:border-[#5B8C51] hover:bg-[#FAFBF8] transition-colors"
              >
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">{guide.title}</h2>
                <p className="text-[#555555] leading-relaxed">{guide.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
