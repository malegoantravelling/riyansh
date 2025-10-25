/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'via.placeholder.com', 'images.pexels.com', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
