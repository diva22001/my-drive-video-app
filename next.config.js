/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Untuk API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  // Jika menggunakan static export (opsional)
  output: 'standalone', // atau 'export' jika perlu static HTML
}

module.exports = nextConfig