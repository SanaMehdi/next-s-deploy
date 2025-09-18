/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dkzmzwxjuhanpsugbeie.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
