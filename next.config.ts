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
  // Logoer i public/ har ikke hash i filnavnet, så de caches i et døgn og fornyes i bakgrunnen
  // i en uke etter det. Byttes en logo, ser alle den nye innen et døgn.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return [
      { source: "/brand/:path*", headers: cache },
      { source: "/partners/:path*", headers: cache },
    ];
  },
  async redirects() {
    return [
      // Adresser fra den forrige versjonen av nettsiden (fjernet oktober 2026), så gamle lenker ikke gir 404
      { source: "/tjenester/fiber-og-telecom", destination: "/tjenester/fiber-og-bredband", permanent: true },
      { source: "/support", destination: "/tjenester/it-support", permanent: true },
      { source: "/kontakt", destination: "/#kontakt", permanent: true },
      { source: "/om-oss", destination: "/#hvorfor", permanent: true },
      { source: "/finn-riktig-losning", destination: "/#kontakt", permanent: true },
      { source: "/prosjekter", destination: "/", permanent: true },
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
