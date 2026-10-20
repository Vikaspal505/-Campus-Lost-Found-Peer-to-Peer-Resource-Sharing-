/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', (static build error since chat service had dynamic routes)
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
