import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    //largePageDataBytes: 128 * 1000, // 128KB by default
    largePageDataBytes: 128 * 100000,
  },
};

export default nextConfig;
