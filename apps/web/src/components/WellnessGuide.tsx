import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { faqJsonLd } from '@/lib/seo'

export type WellnessFaq = { q: string; a: string }

export type WellnessSection = {
  heading: string
  paragraphs: string[]
}

type WellnessGuideProps = {
  kicker: string
  title: string
  lede: string
  sections: WellnessSection[]
  faqs: WellnessFaq[]
  productHref: string
  productLabel: string
  related: { href: string; label: string }[]
}

export default function WellnessGuide({
  kicker,
  title,
  lede,
  sections,
  faqs,
  productHref,
  productLabel,
  related,
}: WellnessGuideProps) {
  return (
    <article className="bg-white">
      <header className="bg-[#4E7A45] text-white py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-semibold tracking-[0.16em] uppercase text-white/80 mb-3">
            {kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            {title}
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">{lede}</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-[#555555] leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <p className="text-[#555555] leading-relaxed">
          Ready to browse? See{' '}
          <Link href={productHref} className="text-[#4E7A45] font-semibold hover:underline">
            {productLabel}
          </Link>{' '}
          or the full{' '}
          <Link href="/store" className="text-[#4E7A45] font-semibold hover:underline">
            Ayurvedic store
          </Link>
          .
        </p>

        <section>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-5">Questions people actually ask</h2>
          <dl className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-[#E8EFE4] pb-5">
                <dt className="font-semibold text-[#1A1A1A] mb-2">{faq.q}</dt>
                <dd className="text-[#555555] leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav aria-label="Related wellness guides" className="pt-4">
          <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Related guides</p>
          <ul className="flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex text-sm font-medium text-[#4E7A45] border border-[#C8E0C0] rounded-full px-4 py-2 hover:bg-[#F3F7F0]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-sm text-[#777777] leading-relaxed border-t border-[#EEEEEE] pt-6">
          This guide is educational. Riyansh products are Ayurvedic wellness supplements and are
          not a substitute for medical care. Consult a qualified practitioner for diagnosis or
          treatment.
        </p>
      </div>

      <JsonLd data={faqJsonLd(faqs.map((faq) => ({ question: faq.q, answer: faq.a })))} />
    </article>
  )
}
