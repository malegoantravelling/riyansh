import type { Metadata } from 'next'
import WellnessGuide from '@/components/WellnessGuide'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Ayurvedic Oil for Joint Pain',
  description:
    'Compare Ayurvedic pain-relief oils with internal joint formulas. Learn where Indian herbs for joint comfort fit, and how Riyansh Artho-G is meant to be used.',
  path: '/wellness/joint-pain',
  image: '/image/riyansh_artho_g.png',
})

export default function JointPainGuidePage() {
  return (
    <WellnessGuide
      kicker="Joints and mobility"
      title="Ayurvedic care for joint comfort"
      lede="Oils soothe locally. Internal herbal formulas work through daily use. Most people need a clear split between the two — not a crowded cabinet of both."
      productHref="/products/riyansh-artho-g"
      productLabel="Riyansh Artho-G"
      related={[
        { href: '/wellness/immunity', label: 'Immunity' },
        { href: '/wellness/digestive-health', label: 'Digestion' },
        { href: '/store', label: 'Shop' },
      ]}
      sections={[
        {
          heading: 'Ayurvedic oil for joint pain versus internal formulas',
          paragraphs: [
            'An Ayurvedic pain relief oil is massaged onto stiff knees, shoulders, or the lower back. Warmth, massage, and a few well-known oils can feel immediately comforting. That does not mean the oil “cures” arthritis; it is local care.',
            'Riyansh Artho-G is an internal herbal capsule for everyday musculoskeletal support — flexibility and comfort as part of an active life. It is not a powder mix and not a topical oil. If you already use a trusted oil at night, you can keep that ritual and treat Artho-G as a separate, labelled daily dose.',
          ],
        },
        {
          heading: 'Indian herbs people associate with joints',
          paragraphs: [
            'Shoppers often search for an Indian herb for joint pain and expect a single plant name. Classical practice usually combines several botanicals. Marketing that promises instant repair from one herb is a red flag.',
            'Joint relief powder is another popular format. Powders need careful measuring and palatability. Capsules reduce that friction. Choose the format you will use for months, because joint comfort routines are slow by nature.',
          ],
        },
        {
          heading: 'When to see a clinician instead',
          paragraphs: [
            'Sudden swelling, fever with joint pain, injury, or loss of movement needs medical assessment. Supplements and oils are not first-line care for those signs. For long-standing stiffness, a doctor or physiotherapist can rule out issues that no herbal oil will fix.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Do you sell a Riyansh joint oil?',
          a: 'Our current joint SKU is Artho-G, an internal formula. You can still use a separate topical oil from your practitioner if they recommend one.',
        },
        {
          q: 'Can I use oil and Artho-G on the same day?',
          a: 'Many people separate them: oil after a warm bath, capsule with food. Confirm with a practitioner if you take pain medicines or blood thinners.',
        },
        {
          q: 'Is this for athletes only?',
          a: 'No. Desk workers and older adults often look for the same supportive care. Dose still follows the label, not workout intensity.',
        },
      ]}
    />
  )
}
