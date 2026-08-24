import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const guides = [
  {
    href: '/wellness/immunity',
    topic: 'Immunity',
    title: 'Immunity syrups and tablets',
    summary:
      'When a daily herbal tonic makes sense versus capsules, and how Amrit Juice fits an Indian household routine.',
    image: '/image/riyansh_amrit_juice.png',
    imageAlt: 'Riyansh Amrit Juice bottle',
    featured: true,
  },
  {
    href: '/wellness/joint-pain',
    topic: 'Joints',
    title: 'Joint comfort and herbal oils',
    summary:
      'How topical oils differ from internal formulas such as Artho-G, and what Indian herbs for joint pain usually means.',
    image: '/image/riyansh_artho_g.png',
    imageAlt: 'Riyansh Artho-G joint care formula',
    featured: false,
  },
  {
    href: '/wellness/digestive-health',
    topic: 'Digestion',
    title: 'Gas, acidity, and digestion',
    summary:
      'A calm look at Ayurvedic digestive care: diet first, then supportive tonics, without miracle claims.',
    image: '/image/riyansh_daibo_g.png',
    imageAlt: 'Riyansh Daibo-G metabolic care formula',
    featured: false,
  },
  {
    href: '/wellness/womens-health',
    topic: 'Women',
    title: 'Women’s health tonics',
    summary:
      'What a women’s Ayurvedic tonic is for, who should pause before using one, and where Lady Life Care sits.',
    image: '/image/riyansh_lady_life.png',
    imageAlt: 'Riyansh Lady Life Care formula',
    featured: false,
  },
  {
    href: '/wellness/hair-and-skin',
    topic: 'Hair & skin',
    title: 'Hair and skin from within',
    summary:
      'Honest notes on hair-fall and oily-skin searches: we do not sell oils or soaps, but several herbs overlap.',
    image: '/image/riyansh_amrit_juice.png',
    imageAlt: 'Riyansh herbal tonic for inner wellness',
    featured: false,
  },
]

export function WellnessHub() {
  const featured = guides.find((guide) => guide.featured) ?? guides[0]
  const rest = guides.filter((guide) => guide.href !== featured.href)

  return (
    <div className="page-shell surface-band pb-20">
      <div className="container-editorial py-10 sm:py-14">
        <header className="mb-12 max-w-2xl lg:mb-16">
          <p className="eyebrow mb-2">Wellness</p>
          <h1 className="font-display text-3xl font-medium tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
            Ayurvedic wellness guides
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone">
            Practical reading for immunity, joints, digestion, women’s health, hair, and skin.
          </p>
          <div className="mt-7">
            <Button asChild className="rounded-full">
              <Link href="/store">Shop products</Link>
            </Button>
          </div>
        </header>

        <div className="space-y-6">
          <Link
            href={featured.href}
            className="group grid overflow-hidden rounded-[1.75rem] border border-evergreen/10 bg-white/80 shadow-soft backdrop-blur-sm transition-shadow duration-500 hover:shadow-lift lg:grid-cols-12"
          >
            <div className="relative flex min-h-[240px] items-center justify-center bg-sage-mist p-8 lg:col-span-5 lg:min-h-[320px]">
              <Image
                src={featured.image}
                alt={featured.imageAlt}
                width={360}
                height={360}
                className="h-56 w-auto object-contain transition-transform duration-700 ease-premium group-hover:scale-105 sm:h-64"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                {featured.topic}
              </p>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight text-charcoal sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone sm:text-base">
                {featured.summary}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest transition-all group-hover:gap-3">
                Read guide
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {rest.map((guide, index) => (
              <li key={guide.href}>
                <Link
                  href={guide.href}
                  className={cn(
                    'group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-evergreen/10 bg-white/70 shadow-soft backdrop-blur-sm transition-shadow duration-500 hover:shadow-lift',
                    index === 0 ? 'bg-sage-mist/40' : ''
                  )}
                >
                  <div className="flex h-44 items-center justify-center bg-ivory-deep/80 px-6">
                    <Image
                      src={guide.image}
                      alt={guide.imageAlt}
                      width={220}
                      height={220}
                      className="h-36 w-auto object-contain transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest">
                      {guide.topic}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-medium tracking-tight text-charcoal">
                      {guide.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-stone">{guide.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest transition-all group-hover:gap-3">
                      Read guide
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-14 max-w-2xl border-t border-evergreen/10 pt-6 text-sm leading-relaxed text-stone">
          These guides are educational. Riyansh products are Ayurvedic wellness supplements, not a
          substitute for medical care. Speak with a qualified practitioner for diagnosis or
          treatment.
        </p>
      </div>
    </div>
  )
}
