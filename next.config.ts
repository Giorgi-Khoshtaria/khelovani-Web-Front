import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd())],
  },
  images: {
    // AVIF first (smaller), WebP fallback — applies to the hero LCP and every
    // next/image on the site.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
