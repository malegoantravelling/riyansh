/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow LAN devices (phones) hitting the Next dev server by IP
  allowedDevOrigins: ['http://192.168.1.8:3000', '192.168.1.8', '127.0.0.1', 'localhost'],
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
    ],
  },
  // Tree-shake lucide-react so only used icons are bundled — reduces chunk size ~60%
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
