import type { Metadata } from "next";
import { projects, websitePackages } from "@/content/projects";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/projects/project-card";
import { PackageCard } from "@/components/projects/package-card";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = { title: "Prosjekter", description: "Prosjekter og nettsidepakker fra IT Kompass AS." };

export default function ProjectsPage() {
  return <main id="main">
    <PageHero eyebrow="Prosjekter" title="Se hva vi bygger." body="Denne siden er også utstillingsvinduet for nettsidene vi leverer. Vi fyller inn ekte prosjekter etter hvert som de er klare for publisering." />
    <section className="section-pad"><div className="container-shell grid gap-5 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></section>
    <section className="section-pad bg-[#050f1b]"><div className="container-shell"><SectionHeading eyebrow="Nettsidepakker" title="Tre nivåer. Ett tydelig mål." body="Pakkeprisene vises som plassholdere til reelle priser er satt. Innholdet er strukturert slik at det enkelt kan kobles til CMS senere."/><div className="mt-10 grid gap-5 lg:grid-cols-3">{websitePackages.map((pack) => <PackageCard key={pack.name} pack={pack} />)}</div></div></section>
  </main>;
}
