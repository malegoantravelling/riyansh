import type { Metadata } from 'next'

export const SITE_URL = 'https://riyanshamrit.com'
export const SITE_NAME = 'Riyansh'
export const LEGAL_NAME = 'Riyansh Multitrade Private Limited'
export const DEFAULT_OG_IMAGE = '/image/riyansh_amrit_juice.png'
export const DEFAULT_TITLE = 'Ayurvedic Immunity Syrup & Herbal Supplements'
export const DEFAULT_DESCRIPTION =
  'Shop authentic Ayurvedic supplements from Riyansh — immunity syrup, joint care, and women’s health tonics made in Maharashtra since 2019. Free delivery above ₹500.'

type PageMetaInput = {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path
  const normalised = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalised}`
}

export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url,
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },
  }
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: LEGAL_NAME,
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl(DEFAULT_OG_IMAGE),
  foundingDate: '2019',
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  publisher: {
    '@type': 'Organization',
    name: LEGAL_NAME,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/store?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
