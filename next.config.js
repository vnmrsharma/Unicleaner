/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
  images: {
    domains: [],
  },
  env: {
    CUSTOM_KEY: 'unicleaner-by-unineed',
  }
}

module.exports = nextConfig 