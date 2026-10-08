import Link from "next/link";
import { homeWebsites } from "@/content/home";
import { SectionHeading } from "@/components/site/section-heading";
import { DeviceMockup } from "@/components/site/device-mockup";
import { Arrow } from "@/components/ui/arrow";

const capabilities = ["Design", "Utvikling", "Hosting", "SEO", "Innhold"];

export function WebsitesSection() {
  return (
    <section className="section-pad relative overflow-hidden bg-soft" aria-labelledby="nettsider-heading">
      <div className="container-shell">
        <SectionHeading id="nettsider-heading" eyebrow={homeWebsites.eyebrow} title={homeWebsites.title} body={homeWebsites.body} />

        <div className="mt-14 grid items-start gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <div data-reveal="clip">
            <DeviceMockup className="aspect-[4/3] sm:aspect-[16/11]" />
          </div>
          <div data-reveal style={{ ["--d" as string]: ".15s" }} className="surface-card flex flex-col p-7 sm:p-8">
            <h3 className="card-title text-[22px] text-ink">{homeWebsites.growth.title}</h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-muted">{homeWebsites.growth.text}</p>
            <ul className="mt-7 grid gap-3" aria-label="Det som inngår">
              {capabilities.map((item, i) => (
                <li key={item} className="flex items-center justify-between border-b border-line pb-3 text-[15px] font-medium text-ink last:border-b-0">
                  {item}
                  <span className="tabular text-xs text-faint">0{i + 1}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto grid gap-3 pt-8">
              <Link href="/tjenester/nettsider#pakker" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-brand">
                <span className="link-underline">Se pakker og priser</span> <Arrow />
              </Link>
              <Link href="/kontakt" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ink">
                <span className="link-underline">Snakk med oss om nettside</span> <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
