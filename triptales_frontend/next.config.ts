import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - Removes static export to allow server runtime and API routes
 * - Enables remote image patterns for common hosts (extend as needed)
 * - Sets experimental typed routes and server actions (safe defaults)
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" }
    ]
  },
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: "4mb"
    }
  }
};

export default nextConfig;
