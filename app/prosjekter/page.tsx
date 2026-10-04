import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { projects, websitePackages } from "@/content/projects";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { PackageCard } from "@/components/projects/package-card";
import { SectionHeading } from "@/components/site/section-heading";
import { DeviceMockup } from "@/components/site/device-mockup";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";

export const metadata: Metadata = pageMetadata({ title: "Prosjekter og nettsidepakker", description: "Nettsider og prosjekter fra IT Kompass AS, og nettsidepakkene Start, Pro og Premium.", path: "/prosjekter" });

export default function ProjectsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/prosjekter", label: "Prosjekter" }]} eyebrow="Prosjekter" title="Se hva vi bygger." body="Nettsider er en del av det vi leverer. Her viser vi utvalgte prosjekter og pakkene vi tilbyr." cta={{ href: "#pakker", label: "Se nettsidepakker" }} />

      <section className="section-pad" aria-labelledby="prosjekter-heading">
        <div className="container-shell">
          <SectionHeading id="prosjekter-heading" eyebrow="Utvalgte prosjekter" title="Arbeid vi er stolte av." align="left" />
          {projects.length ? (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
          ) : (
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr] lg:gap-16">
              <div data-reveal="clip"><DeviceMockup className="aspect-[4/3] sm:aspect-[16/11]" /></div>
              <div data-reveal style={{ ["--d" as string]: ".15s" }}>
                <h3 className="card-title text-[28px] leading-tight text-ink">Prosjektene publiseres her fortløpende.</h3>
                <p className="mt-4 text-[16px] leading-7 text-muted">Vi viser fram kundeprosjekter når de er ferdige og klare for publisering. Vil du se hva vi kan lage for din virksomhet, tar vi gjerne en prat.</p>
                <Link href="/kontakt" className={`${buttonVariants({ size: "lg" })} mt-8`}>Snakk med oss <Arrow /></Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="pakker" className="section-pad scroll-mt-24 bg-soft" aria-labelledby="pakker-heading">
        <div className="container-shell">
          <SectionHeading id="pakker-heading" eyebrow="Nettsidepakker" title="Tre nivåer. Ett tydelig mål." body="Velg nivået som passer virksomheten i dag. Det er enkelt å bygge videre senere. Prisene fylles inn når pakkene er bestemt." />
          <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">{websitePackages.map((pack, i) => <PackageCard key={pack.name} pack={pack} index={i} />)}</div>
        </div>
      </section>
    </main>
  );
}
