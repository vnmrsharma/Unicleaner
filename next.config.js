/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
  images: {
    domains: [],
  },
  env: {
    CUSTOM_KEY: 'unicleaner-by-unineed',
  }
}

module.exports = nextConfig 