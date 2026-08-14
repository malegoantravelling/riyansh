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

export default function HomeSeoContent() {
  return (
    <section className="py-16 md:py-20 bg-white border-t border-[#EEEEEE]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5B8C51] mb-3">
          Ayurvedic wellness, explained
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-5 leading-tight">
          How Indian families use Riyansh herbal supplements
        </h2>
        <div className="space-y-4 text-[#555555] leading-relaxed text-base md:text-[17px]">
          <p>
            People search for Ayurvedic medicine when they want a familiar, plant-based routine —
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

        <article className="mt-12 space-y-10">
          <div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              Ayurvedic medicine for immunity
            </h3>
            <p className="text-[#555555] leading-relaxed mb-3">
              If you are looking for an Ayurvedic immunity booster syrup, start with{' '}
              <Link href="/products/riyansh-amrit-juice" className="text-[#4E7A45] font-semibold hover:underline">
                Riyansh Amrit Juice
              </Link>
              . It is a ready-to-drink herbal tonic — closer to a syrup than a tablet — blending
              herbs such as Ashwagandha, Amla, Aloe Vera, and Brahmi. Families typically take it
              daily rather than only when they feel run-down.
            </p>
            <p className="text-[#555555] leading-relaxed">
              Prefer tablets? Browse{' '}
              <Link href="/store" className="text-[#4E7A45] font-semibold hover:underline">
                Ayurvedic supplements
              </Link>{' '}
              in the store. Capsules suit people who travel or dislike the taste of juices. A
              longer guide lives on our{' '}
              <Link href="/wellness/immunity" className="text-[#4E7A45] font-semibold hover:underline">
                immunity wellness page
              </Link>
              .
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              Joint comfort and herbal pain care
            </h3>
            <p className="text-[#555555] leading-relaxed">
              Searches for Ayurvedic oil for joint pain or pain-relief oils are common, and
              topical oils can be part of a home routine. Riyansh also offers{' '}
              <Link href="/products/riyansh-artho-g" className="text-[#4E7A45] font-semibold hover:underline">
                Artho-G
              </Link>
              , an internal herbal formula for mobility and everyday joint comfort. Read how
              internal and external care differ on{' '}
              <Link href="/wellness/joint-pain" className="text-[#4E7A45] font-semibold hover:underline">
                joint pain wellness
              </Link>
              .
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              Gas, acidity, and women’s health tonics
            </h3>
            <p className="text-[#555555] leading-relaxed mb-3">
              Several customers mention digestive ease after using Amrit Juice as part of meals
              and sleep hygiene — an Ayurvedic remedy for gas is rarely one bottle alone. See{' '}
              <Link href="/wellness/digestive-health" className="text-[#4E7A45] font-semibold hover:underline">
                digestive health
              </Link>{' '}
              for a practical, non-alarmist overview.
            </p>
            <p className="text-[#555555] leading-relaxed">
              For a women’s Ayurvedic health tonic,{' '}
              <Link href="/products/riyansh-lady-life-care" className="text-[#4E7A45] font-semibold hover:underline">
                Lady Life Care
              </Link>{' '}
              is formulated for everyday feminine wellness. Details and cautions are on{' '}
              <Link href="/wellness/womens-health" className="text-[#4E7A45] font-semibold hover:underline">
                women’s health
              </Link>
              .
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              Hair, skin, and herbs used from within
            </h3>
            <p className="text-[#555555] leading-relaxed">
              We do not currently sell a standalone hair oil, scrub, or soap. Amla, Aloe, and
              antioxidant berries in Amrit Juice are the same class of botanicals people look
              for in Ayurvedic hair and skin routines. If your goal is hair fall or oily skin,
              start with diet, sleep, and a practitioner’s advice, then see{' '}
              <Link href="/wellness/hair-and-skin" className="text-[#4E7A45] font-semibold hover:underline">
                hair and skin wellness
              </Link>{' '}
              for an honest map of what internal herbs can and cannot do.
            </p>
          </div>
        </article>

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6">Common questions</h3>
          <dl className="space-y-5">
            {faqs.map((item) => (
              <div key={item.q} className="border-b border-[#E8EFE4] pb-5">
                <dt className="font-semibold text-[#1A1A1A] mb-2">{item.q}</dt>
                <dd className="text-[#555555] leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-10 text-sm text-[#777777] leading-relaxed border-t border-[#EEEEEE] pt-6">
          Disclaimer: Riyansh products are Ayurvedic wellness supplements. They are not a
          substitute for professional diagnosis or treatment. Always follow the label and consult
          a qualified healthcare provider for personal medical conditions.
        </p>
      </div>
    </section>
  )
}

export const homeFaqs = faqs
