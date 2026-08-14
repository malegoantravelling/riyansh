import type { Metadata } from 'next'
import WellnessGuide from '@/components/WellnessGuide'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Ayurvedic Tonic for Women’s Health',
  description:
    'What a women’s Ayurvedic health tonic is for, when to skip self-experimenting, and how Riyansh Lady Life Care is positioned as everyday feminine wellness support.',
  path: '/wellness/womens-health',
  image: '/image/riyansh_lady_life.png',
})

export default function WomensHealthGuidePage() {
  return (
    <WellnessGuide
      kicker="Women’s wellness"
      title="Ayurvedic medicine for women’s health"
      lede="A tonic is a daily supportive formula, not a stand-in for gynaecology. Riyansh Lady Life Care is built for ordinary vitality — with clear limits."
      productHref="/products/riyansh-lady-life-care"
      productLabel="Riyansh Lady Life Care"
      related={[
        { href: '/wellness/immunity', label: 'Immunity' },
        { href: '/wellness/hair-and-skin', label: 'Hair and skin' },
        { href: '/store', label: 'Shop' },
      ]}
      sections={[
        {
          heading: 'What a women’s Ayurvedic health tonic is',
          paragraphs: [
            'Shoppers use “tonic” to mean a regular herbal product for energy, cycle comfort, or general feminine wellness. It is not a contraceptive, not a fertility drug, and not a treatment for PCOS, endometriosis, or thyroid disease unless a clinician says otherwise.',
            'Lady Life Care is Riyansh’s women-focused Ayurvedic formulation for hormonal balance in the everyday sense — vitality and routine support — not a prescription hormone. Read the label, and do not combine it with other “women’s boosters” just because the category sounds similar.',
          ],
        },
        {
          heading: 'Who should talk to a practitioner first',
          paragraphs: [
            'Pregnancy, breastfeeding, IVF protocols, unexplained bleeding, severe period pain, or a new lump always come before e-commerce. Ayurvedic medicine for women’s health is a crowded search term; your history is more specific than any product page.',
            'If you already take iron, thyroid medicine, or hormonal contraception, bring the full list to your doctor or Ayurvedic physician. Stacking supplements is how “natural” routines become confusing.',
          ],
        },
        {
          heading: 'How this sits next to immunity syrups',
          paragraphs: [
            'Some households use Amrit Juice as a family tonic and Lady Life Care as the women-specific capsule. That can be reasonable if doses stay on-label and one person is not taking five herbal SKUs. If budget allows only one product, choose based on the main goal — general immunity versus women-focused care — rather than buying both “just in case.”',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is Lady Life Care a syrup?',
          a: 'It is a women-focused formulation in our range (see the product page for pack format). Amrit Juice is the family’s liquid tonic.',
        },
        {
          q: 'Can teenagers use a women’s tonic?',
          a: 'Only with professional advice. Growth, cycles, and eating patterns need a clinician, not a default adult dose.',
        },
        {
          q: 'Will this fix hair fall by itself?',
          a: 'Unlikely. Hair changes have many causes. See our hair and skin guide and consider a dermatologist if shedding is sudden or patchy.',
        },
      ]}
    />
  )
}
