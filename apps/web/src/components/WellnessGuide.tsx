import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { faqJsonLd } from '@/lib/seo'
import { Button } from '@/components/ui/button'

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
    <article className="page-shell surface-band pb-20">
      <div className="border-b border-forest/10 bg-ivory-deep/50">
        <div className="container-editorial py-3">
          <nav className="flex items-center gap-2 text-xs text-stone sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="font-medium transition-colors hover:text-forest">
              Home
            </Link>
            <span>/</span>
            <Link href="/wellness" className="font-medium transition-colors hover:text-forest">
              Wellness
            </Link>
            <span>/</span>
            <span className="truncate font-semibold text-charcoal">{kicker}</span>
          </nav>
        </div>
      </div>

      <div className="container-editorial py-10 lg:py-14">
        <header className="mb-12 max-w-3xl">
          <p className="eyebrow mb-3">{kicker}</p>
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone sm:text-lg">{lede}</p>
        </header>

        <div className="max-w-3xl space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 font-display text-2xl font-medium tracking-tight text-charcoal">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mb-4 text-sm leading-relaxed text-stone sm:text-base">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-evergreen/10 bg-white/70 p-6 shadow-soft">
            <p className="mr-auto text-sm text-stone">
              Ready to browse? See {productLabel} or the full Ayurvedic store.
            </p>
            <Button asChild className="rounded-full">
              <Link href={productHref}>{productLabel}</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/store">Store</Link>
            </Button>
          </div>

          <section>
            <h2 className="mb-5 font-display text-2xl font-medium tracking-tight text-charcoal">
              Questions people actually ask
            </h2>
            <dl className="space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-b border-evergreen/10 pb-5 last:border-b-0">
                  <dt className="mb-2 font-semibold text-charcoal">{faq.q}</dt>
                  <dd className="text-sm leading-relaxed text-stone sm:text-base">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <nav aria-label="Related wellness guides" className="pt-2">
            <p className="mb-3 text-sm font-semibold text-charcoal">Related guides</p>
            <ul className="flex flex-wrap gap-2">
              {related.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-full border border-forest/20 bg-white px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="border-t border-evergreen/10 pt-6 text-sm leading-relaxed text-stone">
            This guide is educational. Riyansh products are Ayurvedic wellness supplements and are
            not a substitute for medical care. Consult a qualified practitioner for diagnosis or
            treatment.
          </p>
        </div>
      </div>

      <JsonLd data={faqJsonLd(faqs.map((faq) => ({ question: faq.q, answer: faq.a })))} />
    </article>
  )
}
