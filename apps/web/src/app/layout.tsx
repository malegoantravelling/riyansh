import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { ToastProvider } from '@/contexts/ToastContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { OAuthLandingHandler } from '@/components/OAuthLandingHandler'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'ayurvedic supplements',
    'ayurvedic immunity syrup',
    'ayurvedic medicine for immunity',
    'joint pain ayurvedic oil',
    'women’s ayurvedic health tonic',
  ],
  authors: [{ name: 'Riyansh Multitrade Private Limited' }],
  creator: SITE_NAME,
  publisher: 'Riyansh Multitrade Private Limited',
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Riyansh Amrit Ayurvedic wellness products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <ToastProvider>
          <AuthProvider>
            <OAuthLandingHandler />
            <WishlistProvider>
              <CartProvider>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
