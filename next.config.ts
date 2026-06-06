import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the on-screen Next.js dev indicator (the circular "N" badge).
  // Dev-only; production builds never show it. Compile/runtime errors still surface.
  devIndicators: false,
};

export default nextConfig;
