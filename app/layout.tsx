import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/config/site";

// Inter (SIL Open Font License, se app/fonts/OFL-Inter.txt). Latin-delsettet dekker æ, ø og å.
const inter = localFont({
  src: "./fonts/inter-latin-wght.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "IT Kompass AS | IT og telecom. Én partner.",
    template: "%s | IT Kompass AS",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: "IT Kompass AS | IT og telecom. Én partner.",
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "nb_NO",
    type: "website",
    images: [{ url: "/brand/it-kompass-logo.png", width: 640, height: 180, alt: site.name }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="nb" className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">Hopp til hovedinnhold</a>
        <SmoothScroll />
        <SiteHeader />
        {children}
        <SiteFooter />
        {site.plausibleDomain ? (
          <Script defer data-domain={site.plausibleDomain} src="https://plausible.io/js/script.js" />
        ) : null}
      </body>
    </html>
  );
}
