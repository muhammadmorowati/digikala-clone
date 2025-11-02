import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "www.digikala.com",
      },
    ],
  },
};

export default nextConfig;
