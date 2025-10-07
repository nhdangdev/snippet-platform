import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['api.dicebear.com', 'avatars.dicebear.com'],
  },
};

export default nextConfig;
