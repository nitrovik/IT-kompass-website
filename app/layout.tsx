import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { ChatWidget } from "@/components/layout/chat-widget";
import { site } from "@/config/site";
import { servicesNav } from "@/content/services";

// Inter for all tekst (SIL Open Font License, se app/fonts/). Reserveskriften er målt for normal og
// fet vekt og definert i globals.css (ingen tekst som hopper når skriften lastes).
const inter = localFont({ src: "./fonts/inter-latin-wght.woff2", weight: "100 900", display: "swap", variable: "--font-inter", adjustFontFallback: false, fallback: ["Inter Fallback Metric"] });
// Pilen ↗ fra Inter (mangler i det vanlige utvalget). Brukes bare der tegnet står (unicode-range), 1,5 kB.
const interArrow = localFont({ src: "./fonts/inter-arrow-wght.woff2", weight: "100 900", display: "swap", variable: "--font-inter-arrow", adjustFontFallback: false, declarations: [{ prop: "unicode-range", value: "U+2197" }] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "IT Kompass AS | IT og telecom med én kontakt",
    template: "%s | IT Kompass AS",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: "IT Kompass AS | IT og telecom med én kontakt",
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "nb_NO",
    type: "website",
    images: [{ url: "/brand/it-kompass-logo.png", width: 640, height: 180, alt: site.name }],
  },
  twitter: { card: "summary", title: "IT Kompass AS | IT og telecom med én kontakt", description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f8fb",
  colorScheme: "light",
};

/*
  Avdekkingsanimasjonene skjuler innhold til det kommer til syne. Klassen settes før
  første tegning, og fjernes igjen hvis JavaScript av en eller annen grunn ikke starter,
  slik at innholdet aldri blir liggende usynlig.
*/
// Elementer som allerede er synlige når siden åpnes, vises med en gang (uten å vente på JavaScript-pakkene).
// Leser alle posisjoner først og skriver etterpå (én layoutberegning, ikke én per element)
const revealVisibleNow = `(function(){var h=innerHeight,els=document.querySelectorAll('[data-reveal]'),show=[];els.forEach(function(el){if(el.getBoundingClientRect().top<h)show.push(el)});show.forEach(function(el){el.setAttribute('data-inview','true');el.setAttribute('data-instant','')})})();`;

const revealBootstrap = `(function(){var d=document.documentElement;d.classList.add('js-reveal');setTimeout(function(){if(!d.hasAttribute('data-reveal-ready'))d.classList.remove('js-reveal')},3500)})();`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="nb" className={`${inter.variable} ${interArrow.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Hopp til hovedinnhold</a>
        <RevealObserver />
        <SiteHeader servicesNav={servicesNav} />
        {children}
        <SiteFooter />
        <script dangerouslySetInnerHTML={{ __html: revealVisibleNow }} />
        {site.plausibleDomain ? <Script defer data-domain={site.plausibleDomain} src="https://plausible.io/js/script.js" /> : null}
        <ChatWidget />
      </body>
    </html>
  );
}
