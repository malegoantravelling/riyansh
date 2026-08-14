import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { createServerSupabase } from '@/lib/supabaseServer'

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] =
  [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
    { path: '/store', changeFrequency: 'daily', priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/wellness', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/wellness/immunity', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/wellness/joint-pain', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/wellness/womens-health', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/wellness/digestive-health', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/wellness/hair-and-skin', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/shipping', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/cancellation-refund', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  ]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((item) => ({
    url: `${SITE_URL}${item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }))

  try {
    const supabase = createServerSupabase()
    if (supabase) {
      const { data } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('is_active', true)
        .limit(200)

      for (const product of data || []) {
        if (!product?.slug) continue
        entries.push({
          url: `${SITE_URL}/products/${product.slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch {
    // Keep static URLs even if product fetch fails at build time.
  }

  return entries
}
