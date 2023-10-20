/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    env: {
      API: process.env['NEXT_PUBLIC_APP_ENV'],
    },
  },
}

module.exports = nextConfig
