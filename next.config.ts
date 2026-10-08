import type { NextConfig } from "next";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.itkompass.no");
// Den andre varianten av domenet (med eller uten www) sendes videre til hovedadressen.
const alternateHost = siteUrl.hostname.startsWith("www.") ? siteUrl.hostname.slice(4) : `www.${siteUrl.hostname}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Gir plass til vedlegg i supportskjemaet (maks 4 MB, se lib/limits.ts).
    serverActions: { bodySizeLimit: "5mb" },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: alternateHost.replace(/\./g, "\\.") }],
        destination: `${siteUrl.origin}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
