import type { Metadata } from 'next'
import WellnessGuide from '@/components/WellnessGuide'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Ayurvedic Remedy for Gas and Acidity',
  description:
    'A practical Ayurvedic look at gas and acidity: meal timing, what a digestive tonic can support, and how Riyansh Amrit Juice is used alongside — not instead of — medical care.',
  path: '/wellness/digestive-health',
  image: '/image/riyansh_amrit_juice.png',
})

export default function DigestiveHealthGuidePage() {
  return (
    <WellnessGuide
      kicker="Digestion"
      title="Ayurvedic medicine for gas and acidity"
      lede="Digestive discomfort is common and usually lifestyle-heavy. Herbs can sit in the routine; they should not delay care when pain is severe."
      productHref="/products/riyansh-amrit-juice"
      productLabel="Riyansh Amrit Juice"
      related={[
        { href: '/wellness/immunity', label: 'Immunity' },
        { href: '/wellness/womens-health', label: 'Women’s health' },
        { href: '/store', label: 'Shop' },
      ]}
      sections={[
        {
          heading: 'Start with meals, then consider a tonic',
          paragraphs: [
            'An Ayurvedic remedy for gas often begins with slower eating, less late-night spice, and a gap between dinner and sleep. People skip those steps and buy another bottle. The bottle cannot outrun a pattern of rushed meals.',
            'Amrit Juice includes botanicals traditionally used around digestion and daily vitality. Some customers describe less acidity when the juice is part of an otherwise steadier diet. That is supportive, not a diagnosis of reflux or ulcer disease.',
          ],
        },
        {
          heading: 'What “ayurvedic medicine for gas and acidity” should not promise',
          paragraphs: [
            'No honest brand can guarantee that one syrup ends heartburn for everyone. Red-flag symptoms — vomiting blood, black stools, unexplained weight loss, or pain that wakes you at night — need a physician promptly.',
            'If you already take antacids or acid-reducing drugs, ask your doctor before adding herbal products. Interactions are uncommon in marketing copy and still worth a real conversation.',
          ],
        },
        {
          heading: 'A simple two-week check',
          paragraphs: [
            'Keep a short food note, take the labelled serving, and review sleep. If nothing changes and meals are already reasonable, stop guessing and get examined. If you feel better, keep the smallest routine that holds — not an ever-growing stack of digestive SKUs.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Can I drink Amrit Juice after a heavy meal?',
          a: 'Follow the label. Many people take a serving after food. It is not an emergency antacid for sudden burning.',
        },
        {
          q: 'Is this safe with allopathic acidity tablets?',
          a: 'Only your clinician can answer for your prescription list. Bring the Amrit Juice ingredient panel to the appointment.',
        },
        {
          q: 'Does a tonic replace walking after meals?',
          a: 'No. A ten-minute walk and an earlier dinner often do more for gas than any supplement.',
        },
      ]}
    />
  )
}
