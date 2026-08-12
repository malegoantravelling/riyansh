const path = require('path')

/** @type {import('next').NextConfig} */
const lanHost = process.env.NEXT_PUBLIC_DEV_LAN_HOST || '192.168.1.8'
const monorepoRoot = path.join(__dirname, '../..')
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },

  logging: isProd ? false : false,

  ...(isProd
    ? {}
    : {
        allowedDevOrigins: [
          `http://${lanHost}:3000`,
          lanHost,
          'http://127.0.0.1:3000',
          '127.0.0.1',
          'http://localhost:3000',
          'localhost',
        ],
      }),

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'riyanshamrit.com' },
      { protocol: 'https', hostname: '**.riyanshamrit.com' },
      ...(isProd
        ? []
        : [
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'http', hostname: '127.0.0.1' },
            { protocol: 'http', hostname: lanHost },
          ]),
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
