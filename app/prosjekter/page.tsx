import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, websitePackages } from "@/content/projects";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { PackageCard } from "@/components/projects/package-card";
import { SectionHeading } from "@/components/site/section-heading";
import { DeviceMockup } from "@/components/site/device-mockup";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Prosjekter og nettsidepakker",
  description: "Nettsider og prosjekter fra IT Kompass AS, og nettsidepakkene Start, Pro og Premium.",
  alternates: { canonical: "/prosjekter" },
};

export default function ProjectsPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Prosjekter" title="Se hva vi bygger." body="Nettsider er en del av det vi leverer. Her viser vi utvalgte prosjekter og pakkene vi tilbyr." cta={{ href: "#pakker", label: "Se nettsidepakker" }} />

      <section className="section-pad" aria-labelledby="prosjekter-heading">
        <div className="container-shell">
          <SectionHeading id="prosjekter-heading" eyebrow="Utvalgte prosjekter" title="Arbeid vi er stolte av." align="left" />
          {projects.length ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
          ) : (
            <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
              <DeviceMockup className="min-h-[300px] sm:min-h-[380px]" />
              <div>
                <h3 className="text-2xl font-extrabold tracking-[-.02em] text-ink">Prosjektene publiseres her fortløpende.</h3>
                <p className="mt-3 leading-7 text-muted">Vi viser fram kundeprosjekter når de er ferdige og klare for publisering. Vil du se eksempler på hva vi kan lage for din virksomhet, tar vi gjerne en prat.</p>
                <Link href="/kontakt" className={`${buttonVariants({ size: "lg" })} mt-6`}>Snakk med oss <ArrowRight size={17} aria-hidden="true" /></Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="pakker" className="section-pad scroll-mt-24 bg-soft" aria-labelledby="pakker-heading">
        <div className="container-shell">
          <SectionHeading id="pakker-heading" eyebrow="Nettsidepakker" title="Tre nivåer. Ett tydelig mål." body="Velg nivået som passer virksomheten i dag. Det er enkelt å bygge videre senere." />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">{websitePackages.map((pack) => <PackageCard key={pack.name} pack={pack} />)}</div>
        </div>
      </section>
    </main>
  );
}
