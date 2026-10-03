import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "IT Kompass AS | IT og telecom",
    template: "%s | IT Kompass AS",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: site.url },
  openGraph: {
    title: "IT Kompass AS | IT og telecom",
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "nb_NO",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="nb">
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
