import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

function SeoLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-forest underline-offset-4 transition-colors hover:underline"
    >
      {children}
    </Link>
  )
}

const faqs = [
  {
    q: 'How do Indian families use Riyansh herbal supplements?',
    a: 'People look for Ayurvedic medicine when they want a familiar, plant-based routine, not another complicated regimen. Since 2019 Riyansh Multitrade has offered a flagship 42-herb juice for daily immunity and digestion, plus focused formulas for joints, metabolism, and women’s health, sold online from Maharashtra with ISO 9001:2015 certified operations and shipping across India. Claims describe traditional use and supportive wellness, not medical guarantees.',
    body: (
      <>
        People search for Ayurvedic medicine when they want a familiar, plant-based routine, not
        another complicated regimen. Riyansh Multitrade has made that simpler since 2019: a flagship
        42-herb juice for daily immunity and digestion, plus focused formulas for joints,
        metabolism, and women’s health. Everything is sold online from Maharashtra, with ISO
        9001:2015 certified operations and shipping across India.
        <span className="mt-3 block">
          Claims describe traditional use and supportive wellness. They are not medical guarantees.
        </span>
      </>
    ),
  },
  {
    q: 'What Ayurvedic medicine do you offer for immunity?',
    a: 'Riyansh Amrit Juice is a ready-to-drink 42-herb tonic, closer to a syrup than a tablet, blending herbs such as Ashwagandha, Amla, Aloe Vera, and Brahmi. Families typically take it daily rather than only when they feel run-down. Capsules in the store suit people who travel or dislike the taste of juices.',
    body: (
      <>
        If you are looking for an Ayurvedic immunity booster syrup, start with{' '}
        <SeoLink href="/products/riyansh-amrit-juice">Riyansh Amrit Juice</SeoLink>. It is a
        ready-to-drink herbal tonic, closer to a syrup than a tablet, blending herbs such as
        Ashwagandha, Amla, Aloe Vera, and Brahmi. Families typically take it daily rather than only
        when they feel run-down.
        <span className="mt-3 block">
          Prefer tablets? Browse <SeoLink href="/store">Ayurvedic supplements</SeoLink> in the store.
          Capsules suit people who travel or dislike the taste of juices. A longer guide lives on our{' '}
          <SeoLink href="/wellness/immunity">immunity wellness page</SeoLink>.
        </span>
      </>
    ),
  },
  {
    q: 'Do you sell immunity tablets as well as syrup?',
    a: 'Yes. Alongside Amrit Juice, the store includes capsule formulas for targeted needs such as joints and women’s wellness. Choose a syrup if you prefer a drink; tablets or capsules if you want a measured daily dose.',
  },
  {
    q: 'What do you offer for joint comfort and herbal pain care?',
    a: 'Topical Ayurvedic oils can be part of a home routine. Riyansh also offers Artho-G, an internal herbal formula for mobility and everyday joint comfort.',
    body: (
      <>
        Searches for Ayurvedic oil for joint pain or pain-relief oils are common, and topical oils
        can be part of a home routine. Riyansh also offers{' '}
        <SeoLink href="/products/riyansh-artho-g">Artho-G</SeoLink>, an internal herbal formula for
        mobility and everyday joint comfort. Read how internal and external care differ on{' '}
        <SeoLink href="/wellness/joint-pain">joint pain wellness</SeoLink>.
      </>
    ),
  },
  {
    q: 'Can Ayurvedic products help with gas and acidity?',
    a: 'Several classical herbs are used in India for digestive comfort. Amrit Juice includes botanicals historically associated with digestion. Results vary; persistent acidity should be reviewed by a qualified practitioner. An Ayurvedic remedy for gas is rarely one bottle alone.',
    body: (
      <>
        Several customers mention digestive ease after using Amrit Juice as part of meals and sleep
        hygiene. An Ayurvedic remedy for gas is rarely one bottle alone. See{' '}
        <SeoLink href="/wellness/digestive-health">digestive health</SeoLink> for a practical,
        non-alarmist overview. Persistent acidity should be reviewed by a qualified practitioner.
      </>
    ),
  },
  {
    q: 'Do you have a women’s Ayurvedic health tonic?',
    a: 'Lady Life Care is formulated for everyday feminine wellness. Details and cautions are on the women’s health wellness page.',
    body: (
      <>
        For a women’s Ayurvedic health tonic,{' '}
        <SeoLink href="/products/riyansh-lady-life-care">Lady Life Care</SeoLink> is formulated for
        everyday feminine wellness. Details and cautions are on{' '}
        <SeoLink href="/wellness/womens-health">women’s health</SeoLink>.
      </>
    ),
  },
  {
    q: 'Do you sell hair oil or skin products?',
    a: 'We do not currently sell a standalone hair oil, scrub, or soap. Amla, Aloe, and antioxidant berries in Amrit Juice are the same class of botanicals people look for in Ayurvedic hair and skin routines. For hair fall or oily skin, start with diet, sleep, and a practitioner’s advice.',
    body: (
      <>
        We do not currently sell a standalone hair oil, scrub, or soap. Amla, Aloe, and antioxidant
        berries in Amrit Juice are the same class of botanicals people look for in Ayurvedic hair and
        skin routines. If your goal is hair fall or oily skin, start with diet, sleep, and a
        practitioner’s advice, then see{' '}
        <SeoLink href="/wellness/hair-and-skin">hair and skin wellness</SeoLink> for an honest map of
        what internal herbs can and cannot do.
      </>
    ),
  },
  {
    q: 'Are Riyansh products a substitute for medical treatment?',
    a: 'No. Our range is for supportive daily wellness. It is not intended to diagnose, treat, or cure disease. Speak with a doctor or Ayurvedic physician before use if you are pregnant, nursing, or on medication.',
  },
]

export default function HomeSeoContent() {
  return (
    <section className="border-t border-evergreen/10 py-20 md:py-24" aria-labelledby="home-faq-heading">
      <div className="container-editorial">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-3">Ayurvedic wellness, explained</p>
          <h2
            id="home-faq-heading"
            className="font-display text-3xl font-medium leading-tight tracking-tight text-charcoal md:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-stone sm:text-base">
            Clear answers on immunity syrups, joint care, digestion, and what Riyansh does — and
            does not — claim.
          </p>

          <Accordion type="single" collapsible className="mt-10 border-t border-evergreen/10">
            {faqs.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left font-display text-base font-medium tracking-tight text-charcoal hover:no-underline sm:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-stone sm:text-base">
                  {item.body ?? item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <p className="mt-10 border-t border-evergreen/10 pt-6 text-sm leading-relaxed text-stone">
            Disclaimer: Riyansh products are Ayurvedic wellness supplements. They are not a
            substitute for professional diagnosis or treatment. Always follow the label and consult
            a qualified healthcare provider for personal medical conditions.
          </p>
        </div>
      </div>
    </section>
  )
}

export const homeFaqs = faqs.map(({ q, a }) => ({ q, a }))
