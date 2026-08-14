import type { Metadata } from 'next'
import WellnessGuide from '@/components/WellnessGuide'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Ayurvedic Herbs for Hair and Skin',
  description:
    'Riyansh does not sell hair oil or soap. This guide explains Ayurvedic herbs for hair growth and oily skin, and how internal tonics such as Amrit Juice overlap — without fake product claims.',
  path: '/wellness/hair-and-skin',
  image: '/image/riyansh_amrit_juice.png',
})

export default function HairAndSkinGuidePage() {
  return (
    <WellnessGuide
      kicker="Hair and skin"
      title="Ayurvedic herbs for hair and skin — without the catalogue filler"
      lede="Searches for hair oil, scrubs, and oily-skin soap are loud. Our catalogue is juices and capsules. This page stays honest about that gap."
      productHref="/products/riyansh-amrit-juice"
      productLabel="Riyansh Amrit Juice"
      related={[
        { href: '/wellness/womens-health', label: 'Women’s health' },
        { href: '/wellness/immunity', label: 'Immunity' },
        { href: '/wellness', label: 'All guides' },
      ]}
      sections={[
        {
          heading: 'What we sell, and what we do not',
          paragraphs: [
            'Riyansh does not currently offer a branded hair oil, scrub, or soap for oily skin. Pages that pretend otherwise would be the kind of keyword padding search engines now discount — and customers remember.',
            'We do use botanicals that show up in those searches. Amla, Aloe Vera, and antioxidant berries in Amrit Juice are the same families of plants people look for in Ayurvedic hair oil for hair growth or herbal hair oil routines. Internal use is not the same as massaging oil into the scalp.',
          ],
        },
        {
          heading: 'Hair fall is rarely one oil away',
          paragraphs: [
            'Ayurvedic medicine for hair fall is a huge category because shedding has many causes: iron, thyroid, stress, postpartum change, harsh treatments, or simply a tight ponytail. An Ayurvedic hair oil for black hair will not override those.',
            'If shedding is sudden, patchy, or comes with fatigue, see a doctor. If you want a gentle internal tonic while you work on diet and sleep, Amrit Juice is the relevant Riyansh product — not a miracle growth serum.',
          ],
        },
        {
          heading: 'Oily skin and “ayurvedic treatment” language',
          paragraphs: [
            'Ayurvedic treatment for oily skin in clinic terms may include diet, local cleansers, and herbs. Over-the-counter soap and scrub searches are usually about shine and clogged pores. We do not manufacture those SKUs, so we will not rank them with a fake landing page.',
            'Ayurvedic herbs for skin that appear in our juice (including Aloe) support general wellness. They are not a dermatology protocol for acne. Keep expectations at “supportive,” and use a dermatologist for persistent oily or inflamed skin.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Will you launch a Riyansh hair oil?',
          a: 'If we do, it will appear in the store with a real product page. Until then, do not expect an oil SKU on this site.',
        },
        {
          q: 'Can Amrit Juice darken hair?',
          a: 'No responsible brand should promise colour change from a wellness juice. Hair colour is genetics, dye, and time.',
        },
        {
          q: 'What should I buy instead of a scrub?',
          a: 'A mild cleanser from a dermatologist’s list, plus the lifestyle basics. Shop Riyansh only if you also want an internal tonic for general health.',
        },
      ]}
    />
  )
}
