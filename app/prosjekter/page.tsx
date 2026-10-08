import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { DeviceMockup } from "@/components/site/device-mockup";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";

export const metadata: Metadata = pageMetadata({ title: "Prosjekter", description: "Nettsider og prosjekter fra IT Kompass AS.", path: "/prosjekter" });

export default function ProjectsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/prosjekter", label: "Prosjekter" }]} eyebrow="Prosjekter" title="Se hva vi bygger." body="Nettsider er en del av det vi leverer. Her viser vi utvalgte prosjekter." cta={{ href: "/tjenester/nettsider#pakker", label: "Se nettsidepakker og priser" }} />

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
    </main>
  );
}
