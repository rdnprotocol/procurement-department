import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['swfratyjpcgsggzyfere.supabase.co'], // Supabase project URL
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
