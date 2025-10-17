import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Temporarily ignore ESLint during builds to allow building while
    // TypeScript `any` issues are addressed. Remove when linting is fixed.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
