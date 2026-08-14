import type { Metadata } from 'next'
import WellnessGuide from '@/components/WellnessGuide'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Ayurvedic Medicine for Immunity',
  description:
    'Understand Ayurvedic immunity syrups and tablets in India. See how Riyansh Amrit Juice, a 42-herb tonic, fits a daily routine — and when capsules may suit you better.',
  path: '/wellness/immunity',
  image: '/image/riyansh_amrit_juice.png',
})

export default function ImmunityGuidePage() {
  return (
    <WellnessGuide
      kicker="Immunity"
      title="Ayurvedic medicine for immunity: syrup or tablets?"
      lede="Most people want a simple daily habit, not a pharmacy aisle of lookalike boosters. Here is how Riyansh approaches immunity as supportive wellness."
      productHref="/products/riyansh-amrit-juice"
      productLabel="Riyansh Amrit Juice"
      related={[
        { href: '/wellness/digestive-health', label: 'Digestion' },
        { href: '/wellness/joint-pain', label: 'Joints' },
        { href: '/wellness/womens-health', label: 'Women’s health' },
      ]}
      sections={[
        {
          heading: 'What “immunity booster syrup” usually means',
          paragraphs: [
            'In Indian homes, an immunity syrup is often a herbal tonic taken by the spoon or mixed with water. It is not a vaccine and it does not replace rest, food, or medical care when you are ill. Riyansh Amrit Juice is built in that syrup-style tradition: a 42-herb drink with botanicals such as Ashwagandha, Amla, Aloe Vera, and Brahmi.',
            'A best Ayurvedic immunity booster syrup, in practice, is one you will actually finish — palatable, labelled clearly, and made by a company you can contact. Taste and consistency matter more than a long list of trendy ingredients.',
          ],
        },
        {
          heading: 'When tablets or capsules make more sense',
          paragraphs: [
            'Immunity tablets in Ayurveda are simply a different delivery format. Capsules travel well, hide bitter tastes, and make dosing obvious. If you already take other capsules with meals, adding a tablet-style formula can be easier than a juice.',
            'Riyansh also sells targeted capsules in the store for joints and women’s wellness. Those are not generic “best immunity booster tablets India” copies; each SKU has a job. If your only goal is a daily tonic, start with Amrit Juice and review capsules only if a practitioner suggests a more specific path.',
          ],
        },
        {
          heading: 'How to use a tonic without overdoing it',
          paragraphs: [
            'Follow the label: typically a measured serving once or twice a day, not “more is better.” Give a routine several weeks before judging it, and stop if you notice discomfort. Children, pregnancy, and chronic illness need professional advice first.',
            'Pair any Ayurvedic supplement with sleep, protein-rich meals, and outdoor light. Herbs support a lifestyle; they do not replace one.',
          ],
        },
      ]}
      faqs={[
        {
          q: 'Is Amrit Juice the same as an immunity tablet?',
          a: 'No. It is a liquid herbal tonic. Tablets and capsules are a different format. Choose based on taste, travel, and what you will use consistently.',
        },
        {
          q: 'Can I take syrup and capsules together?',
          a: 'Sometimes, but not by stacking every “booster” at once. Ask an Ayurvedic physician if you already take medicines or several herbal products.',
        },
        {
          q: 'How soon should I expect a difference?',
          a: 'Supportive tonics are usually judged over weeks, not overnight. If you have fever, infection, or unexplained fatigue, see a doctor rather than waiting on a supplement.',
        },
      ]}
    />
  )
}
