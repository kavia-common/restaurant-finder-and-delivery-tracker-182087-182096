import type { NextConfig } from "next";

/**
 * Next.js configuration for the food delivery frontend.
 * - output: 'export' ensures static export compatibility for hosting on static providers.
 * - images: configure allowed external domains for Next/Image when using static export.
 *   Note: With output: 'export', prefer using <Image unoptimized /> where applicable.
 */
const nextConfig: NextConfig = {
  // Preserve static export for SSG-only deployment
  output: "export",

  // Images configuration: allow common CDNs used for restaurant photos
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.example.com",
      "res.cloudinary.com",
      "picsum.photos"
    ],
  },
};

export default nextConfig;
