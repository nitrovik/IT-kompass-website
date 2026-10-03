import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Gir plass til vedlegg i supportskjemaet (maks 4 MB, se app/actions/support.ts).
    serverActions: { bodySizeLimit: "5mb" },
  },
};

export default nextConfig;
