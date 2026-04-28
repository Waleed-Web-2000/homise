/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'homisepk.com',
        pathname: '/**',
      }
    ],
    unoptimized: true
  }
}

module.exports = nextConfig
