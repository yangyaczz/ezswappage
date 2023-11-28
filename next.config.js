/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  publicRuntimeConfig: {
    env: {
      API: process.env["NEXT_PUBLIC_APP_ENV"],
    },
  },
  images: {
    //configuration for nextjs to display host images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ezonline.s3.us-west-2.amazonaws.com",
      },{
        protocol: "https",
        hostname: "data.skytest.club",
      },
    ],
  },
};

module.exports = nextConfig;
