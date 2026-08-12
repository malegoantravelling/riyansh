const path = require('path')

/** @type {import('next').NextConfig} */
const lanHost = process.env.NEXT_PUBLIC_DEV_LAN_HOST || '192.168.1.8'
const monorepoRoot = path.join(__dirname, '../..')

const nextConfig = {
  // Monorepo: Next is hoisted to repo root — pin Turbopack root so routes resolve.
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },

  // Silence noisy GET / compile logs + browser→terminal spam in `npm run dev`.
  logging: false,

  // Allow phones / other devices on the LAN to use the Next.js dev server.
  allowedDevOrigins: [
    `http://${lanHost}:3000`,
    lanHost,
    'http://127.0.0.1:3000',
    '127.0.0.1',
    'http://localhost:3000',
    'localhost',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: lanHost,
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
