
const isLocal = process.env.NODE_ENV === 'development'
const apiUrl = isLocal ? 'http://localhost:7709' : 'https://api.idahoguntrader.net'

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  crossOrigin: 'anonymous',
  env: {
    apiUrl,
    segmentKey: ''
  },
  async redirects() {
    return [
      {
        source: '/hq',
        destination: '/hq/dashboard',
        permanent: false,
      },
    ]
  },
}