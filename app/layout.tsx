import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { CompassToTop } from "@/components/layout/compass-to-top";
import { site } from "@/config/site";

// Inter (brødtekst) og Schibsted Grotesk (overskrifter, norsk skrift). Begge SIL Open Font License, se app/fonts/.
const inter = localFont({ src: "./fonts/inter-latin-wght.woff2", weight: "100 900", display: "swap", variable: "--font-inter" });
const schibsted = localFont({ src: "./fonts/schibsted-grotesk-latin-wght.woff2", weight: "400 900", display: "swap", variable: "--font-schibsted" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "IT Kompass AS | IT og telecom. Én partner.",
    template: "%s | IT Kompass AS",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: "IT Kompass AS | IT og telecom. Én partner.",
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "nb_NO",
    type: "website",
    images: [{ url: "/brand/it-kompass-logo.png", width: 640, height: 180, alt: site.name }],
  },
  twitter: { card: "summary", title: "IT Kompass AS | IT og telecom. Én partner.", description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f8fbff",
  colorScheme: "light",
};

/*
  Avdekkingsanimasjonene skjuler innhold til det kommer til syne. Klassen settes før
  første tegning, og fjernes igjen hvis JavaScript av en eller annen grunn ikke starter,
  slik at innholdet aldri blir liggende usynlig.
*/
// Elementer som allerede er synlige når siden åpnes, vises med en gang (uten å vente på JavaScript-pakkene).
const revealVisibleNow = `(function(){var h=innerHeight;document.querySelectorAll('[data-reveal],[data-split]').forEach(function(el){if(el.getBoundingClientRect().top<h){el.setAttribute('data-inview','true');el.setAttribute('data-instant','')}})})();`;

const revealBootstrap = `(function(){var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!d.hasAttribute('data-reveal-ready'))d.classList.remove('js-reveal')},3500)})();`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="nb" className={`${inter.variable} ${schibsted.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Hopp til hovedinnhold</a>
        <SmoothScroll />
        <RevealObserver />
        <SiteHeader />
        {children}
        <SiteFooter />
        <CompassToTop />
        <script dangerouslySetInnerHTML={{ __html: revealVisibleNow }} />
        {site.plausibleDomain ? <Script defer data-domain={site.plausibleDomain} src="https://plausible.io/js/script.js" /> : null}
      </body>
    </html>
  );
}
