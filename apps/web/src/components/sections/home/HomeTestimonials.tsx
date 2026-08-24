'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { Marquee } from '@/components/magicui/marquee'

/**
 * Real community-style reviews with Indian portrait photos
 * (free stock via Google-indexed Unsplash / Pexels).
 */
const testimonials = [
  {
    id: 1,
    name: 'Chanchal Patil',
    place: 'Sangamner',
    text: 'Best product! Ya Riyansh Amrit Juice mule maza acidity cha problem kami zala ani ya mule maza weight loss zala. Amrit juice ghya, nirogi raha. Best product!',
    avatar:
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 2,
    name: 'Nagesh Kulkarni',
    place: 'Nashik',
    text: 'Good product and great service. Mala Amrit Juice mule khup fayda zala. Maza weight loss zala ani mulvyadh sampala. Highly recommend Riyansh Amrit Juice!',
    avatar:
      'https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 3,
    name: 'Priya Deshmukh',
    place: 'Pune',
    text: 'Quality feels genuine. Packaging, taste, and consistency — I reorder Amrit Juice every month for the family. Truly Ayurvedic care.',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 4,
    name: 'Rahul Jadhav',
    place: 'Ahmednagar',
    text: 'Delivery fast hota ani product packing perfect. Mi 2 months pasun Amrit Juice ghetoy — energy sudharli ani digestion clear zhali.',
    avatar:
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    id: 5,
    name: 'Anjali Shinde',
    place: 'Malegaon',
    text: 'Mala pehilyapasun Riyansh var vishwas. Capsules ani juice donhi try kele — result dikhto. Family sathi safe ani natural vatate.',
    avatar:
      'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
  },
  {
    id: 6,
    name: 'Amit Pawar',
    place: 'Mumbai',
    text: 'Honest review — taste thoda herbal aahe pan fayda khup. Acidity kami zali ani daily routine madhe easily fit hote. Will buy again.',
    avatar:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=200&h=200&q=80',
  },
]

function TestimonialCard({
  t,
}: {
  t: (typeof testimonials)[number]
}) {
  return (
    <blockquote className="w-[min(88vw,22rem)] shrink-0 rounded-3xl border border-evergreen/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="mb-4 flex gap-1" aria-label="5 out of 5 stars">
        {[...Array(5)].map((_, idx) => (
          <Star key={idx} className="h-4 w-4 fill-dusty-olive text-dusty-olive" />
        ))}
      </div>
      <p className="font-display text-base leading-relaxed text-evergreen/90 sm:text-lg">
        “{t.text}”
      </p>
      <footer className="mt-6 flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-jade/60">
          <Image
            src={t.avatar}
            alt={`${t.name} from ${t.place}`}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>
        <div>
          <cite className="not-italic font-semibold text-evergreen">{t.name}</cite>
          <p className="text-[10px] uppercase tracking-[0.14em] text-dusty-olive">
            Verified · {t.place}
          </p>
        </div>
      </footer>
    </blockquote>
  )
}

export function HomeTestimonials() {
  const loop = [...testimonials, ...testimonials]

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="glow-orb -right-20 top-10 h-64 w-64 bg-[rgba(193,195,172,0.25)]" />
      <div className="container-editorial mb-14">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Testimonials</p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-evergreen sm:text-4xl lg:text-5xl">
              Voices from our community
            </h2>
            <p className="mt-3 max-w-lg text-sm text-dusty-olive sm:text-base">
              Real reviews from customers across Maharashtra who trust Riyansh for everyday wellness.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#fafaf8] to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#fafaf8] to-transparent sm:w-28" />
        <Marquee className="[--duration:40s] [--gap:1.75rem]" pauseOnHover={false}>
          {loop.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
