import type { Metadata } from "next";
import { site } from "@/config/site";

/* Felles metadata per side: tittel, beskrivelse, canonical og Open Graph for deling. */
export function pageMetadata({ title, description, path, absoluteTitle = false }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.name,
      locale: "nb_NO",
      type: "website",
      images: [{ url: "/brand/it-kompass-logo.png", width: 640, height: 180, alt: site.name }],
    },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
