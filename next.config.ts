import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Allow production builds to successfully complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
