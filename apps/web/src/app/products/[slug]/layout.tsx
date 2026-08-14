import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { JsonLd } from '@/components/JsonLd'
import { absoluteUrl, pageMetadata, SITE_NAME } from '@/lib/seo'
import { createServerSupabase } from '@/lib/supabaseServer'

type Props = {
  params: Promise<{ slug: string }>
  children: ReactNode
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const fallback = pageMetadata({
    title: 'Ayurvedic Product',
    description:
      'View this authentic Riyansh Ayurvedic supplement. Herbal wellness products from Maharashtra with pan-India delivery on eligible orders.',
    path: `/products/${slug}`,
  })

  try {
    const supabase = createServerSupabase()
    if (!supabase) return fallback

    const { data } = await supabase
      .from('products')
      .select('name, description, image_url, slug')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (!data?.name) return fallback

    const description = clip(
      data.description ||
        `${data.name} is an Ayurvedic wellness product from Riyansh Multitrade. Shop genuine herbal supplements with delivery across India.`,
      158
    )

    return pageMetadata({
      title: clip(data.name, 55),
      description,
      path: `/products/${data.slug || slug}`,
      image: data.image_url || '/image/riyansh_amrit_juice.png',
    })
  } catch {
    return fallback
  }
}

export default async function ProductSlugLayout({ children, params }: Props) {
  const { slug } = await params
  let productJsonLd: Record<string, unknown> | null = null

  try {
    const supabase = createServerSupabase()
    if (supabase) {
      const { data } = await supabase
        .from('products')
        .select('name, description, image_url, slug, price')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle()

      if (data?.name) {
        productJsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.name,
          description: data.description || undefined,
          image: data.image_url || absoluteUrl('/image/riyansh_amrit_juice.png'),
          brand: { '@type': 'Brand', name: SITE_NAME },
          url: absoluteUrl(`/products/${data.slug || slug}`),
          ...(typeof data.price === 'number'
            ? {
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'INR',
                  price: data.price,
                  availability: 'https://schema.org/InStock',
                  url: absoluteUrl(`/products/${data.slug || slug}`),
                },
              }
            : {}),
        }
      }
    }
  } catch {
    productJsonLd = null
  }

  return (
    <>
      {productJsonLd ? <JsonLd data={productJsonLd} /> : null}
      {children}
    </>
  )
}
