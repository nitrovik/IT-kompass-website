import type { Metadata } from "next";
import { PartnerBanner } from "@/components/home/partner-banner";
import { partnerSection, partners, type Partner } from "@/content/partners";

/*
  Forhåndsvisning av leverandørbanneret for eieren. Ikke lenket fra nettsiden, ikke i
  sitemap og ikke indeksert. Bruker de ekte logoene når de er lagt inn i content/partners.ts,
  ellers nøytrale plassholdere i ulike proporsjoner (ingen selskapsnavn).
*/
export const metadata: Metadata = { title: "Forhåndsvisning: leverandørbanner", robots: { index: false, follow: false } };

function placeholder(i: number, width: number): Partner {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="40" viewBox="0 0 ${width} 40"><rect x=".5" y=".5" width="${width - 1}" height="39" rx="8" fill="#f4f8fc" stroke="#c3d6e9" stroke-dasharray="4 4"/><text x="50%" y="25" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#8aa0b8">Logo ${i}</text></svg>`;
  return { name: `Plassholder ${i}`, logo: `data:image/svg+xml,${encodeURIComponent(svg)}`, width, height: 40 };
}

const demo = [150, 112, 176, 132, 96, 160].map((width, i) => placeholder(i + 1, width));

export default function PartnerPreviewPage() {
  const real = partners.length > 0;
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="container-shell pt-[calc(var(--header-h)+3rem)] pb-10">
        <p className="eyebrow">Forhåndsvisning</p>
        <h1 className="page-title mt-4 text-ink">Leverandørbanneret</h1>
        <p className="lead mt-4 max-w-2xl">
          {real
            ? "Slik ser banneret ut med logoene som er lagt inn."
            : "Ingen logoer er lagt inn ennå, så banneret vises ikke på forsiden. Her er det med plassholdere. Legg inn ekte logoer i content/partners.ts."}
        </p>
      </div>
      <div className="border-y border-line">
        <PartnerBanner label={partnerSection.label} partners={real ? partners : demo} />
      </div>
      <div className="h-[40vh]" />
    </main>
  );
}
