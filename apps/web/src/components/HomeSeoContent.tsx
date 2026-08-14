import type { ReactNode } from 'react'
import Link from 'next/link'

const faqs = [
  {
    q: 'What is an Ayurvedic immunity syrup?',
    a: 'It is a herbal tonic, usually taken by the spoonful, made from botanicals traditionally used to support everyday resistance and recovery. Riyansh Amrit Juice is our 42-herb syrup-style drink for daily use, not a replacement for prescribed medicine.',
  },
  {
    q: 'Do you sell immunity tablets as well as syrup?',
    a: 'Yes. Alongside Amrit Juice, the store includes capsule formulas for targeted needs such as joints and women’s wellness. Choose a syrup if you prefer a drink; tablets or capsules if you want a measured daily dose.',
  },
  {
    q: 'Can Ayurvedic products help with gas and acidity?',
    a: 'Several classical herbs are used in India for digestive comfort. Amrit Juice includes botanicals historically associated with digestion. Results vary; persistent acidity should be reviewed by a qualified practitioner.',
  },
  {
    q: 'Are Riyansh products a substitute for medical treatment?',
    a: 'No. Our range is for supportive daily wellness. It is not intended to diagnose, treat, or cure disease. Speak with a doctor or Ayurvedic physician before use if you are pregnant, nursing, or on medication.',
  },
]

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

export default function HomeSeoContent() {
  return (
    <section className="border-t border-evergreen/10 py-20 md:py-24">
      <div className="container-editorial">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow mb-3">Ayurvedic wellness, explained</p>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-charcoal md:text-4xl">
            How Indian families use Riyansh herbal supplements
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-stone sm:text-base">
            <p>
              People search for Ayurvedic medicine when they want a familiar, plant-based routine,
              not another complicated regimen. Riyansh Multitrade has made that simpler since 2019:
              a flagship 42-herb juice for daily immunity and digestion, plus focused formulas for
              joints, metabolism, and women’s health. Everything is sold online from Maharashtra,
              with ISO 9001:2015 certified operations and shipping across India.
            </p>
            <p>
              We write this page for shoppers who compared syrups, tablets, and oils and still want
              a clear answer: what we actually make, who it is for, and what it is not. Claims below
              describe traditional use and supportive wellness. They are not medical guarantees.
            </p>
          </div>

          <article className="mt-14 space-y-10">
            <div className="border-t border-evergreen/10 pt-8">
              <h3 className="mb-3 font-display text-xl font-medium tracking-tight text-charcoal sm:text-2xl">
                Ayurvedic medicine for immunity
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-stone sm:text-base">
                If you are looking for an Ayurvedic immunity booster syrup, start with{' '}
                <SeoLink href="/products/riyansh-amrit-juice">Riyansh Amrit Juice</SeoLink>. It is a
                ready-to-drink herbal tonic, closer to a syrup than a tablet, blending herbs such as
                Ashwagandha, Amla, Aloe Vera, and Brahmi. Families typically take it daily rather
                than only when they feel run-down.
              </p>
              <p className="text-sm leading-relaxed text-stone sm:text-base">
                Prefer tablets? Browse <SeoLink href="/store">Ayurvedic supplements</SeoLink> in the
                store. Capsules suit people who travel or dislike the taste of juices. A longer
                guide lives on our <SeoLink href="/wellness/immunity">immunity wellness page</SeoLink>
                .
              </p>
            </div>

            <div className="border-t border-evergreen/10 pt-8">
              <h3 className="mb-3 font-display text-xl font-medium tracking-tight text-charcoal sm:text-2xl">
                Joint comfort and herbal pain care
              </h3>
              <p className="text-sm leading-relaxed text-stone sm:text-base">
                Searches for Ayurvedic oil for joint pain or pain-relief oils are common, and
                topical oils can be part of a home routine. Riyansh also offers{' '}
                <SeoLink href="/products/riyansh-artho-g">Artho-G</SeoLink>, an internal herbal
                formula for mobility and everyday joint comfort. Read how internal and external care
                differ on <SeoLink href="/wellness/joint-pain">joint pain wellness</SeoLink>.
              </p>
            </div>

            <div className="border-t border-evergreen/10 pt-8">
              <h3 className="mb-3 font-display text-xl font-medium tracking-tight text-charcoal sm:text-2xl">
                Gas, acidity, and women’s health tonics
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-stone sm:text-base">
                Several customers mention digestive ease after using Amrit Juice as part of meals
                and sleep hygiene. An Ayurvedic remedy for gas is rarely one bottle alone. See{' '}
                <SeoLink href="/wellness/digestive-health">digestive health</SeoLink> for a
                practical, non-alarmist overview.
              </p>
              <p className="text-sm leading-relaxed text-stone sm:text-base">
                For a women’s Ayurvedic health tonic,{' '}
                <SeoLink href="/products/riyansh-lady-life-care">Lady Life Care</SeoLink> is
                formulated for everyday feminine wellness. Details and cautions are on{' '}
                <SeoLink href="/wellness/womens-health">women’s health</SeoLink>.
              </p>
            </div>

            <div className="border-t border-evergreen/10 pt-8">
              <h3 className="mb-3 font-display text-xl font-medium tracking-tight text-charcoal sm:text-2xl">
                Hair, skin, and herbs used from within
              </h3>
              <p className="text-sm leading-relaxed text-stone sm:text-base">
                We do not currently sell a standalone hair oil, scrub, or soap. Amla, Aloe, and
                antioxidant berries in Amrit Juice are the same class of botanicals people look for
                in Ayurvedic hair and skin routines. If your goal is hair fall or oily skin, start
                with diet, sleep, and a practitioner’s advice, then see{' '}
                <SeoLink href="/wellness/hair-and-skin">hair and skin wellness</SeoLink> for an
                honest map of what internal herbs can and cannot do.
              </p>
            </div>
          </article>

          <div className="mt-14 border-t border-evergreen/10 pt-8">
            <h3 className="mb-6 font-display text-xl font-medium tracking-tight text-charcoal sm:text-2xl">
              Common questions
            </h3>
            <dl className="space-y-6">
              {faqs.map((item) => (
                <div key={item.q} className="border-b border-evergreen/10 pb-6 last:border-b-0 last:pb-0">
                  <dt className="mb-2 font-semibold text-charcoal">{item.q}</dt>
                  <dd className="text-sm leading-relaxed text-stone sm:text-base">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>

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

export const homeFaqs = faqs
