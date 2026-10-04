import Image from "next/image";
import type { Project } from "@/content/projects";
import { DeviceMockup } from "@/components/site/device-mockup";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article data-reveal className="surface-card group overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        {project.image ? <Image src={project.image.src} alt={project.image.alt} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]" /> : <DeviceMockup className="absolute inset-0 rounded-none" />}
      </div>
      <div className="p-7">
        <div className="flex items-center justify-between text-xs font-semibold tracking-[.14em] text-eyebrow uppercase"><span>{project.category}</span><span className="tabular">{project.year}</span></div>
        <h3 className="card-title mt-3 text-[21px] text-ink">{project.title}</h3>
        <p className="mt-2 text-[15px] leading-[1.6] text-muted">{project.description}</p>
      </div>
    </article>
  );
}
