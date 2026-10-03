import Image from "next/image";
import type { Project } from "@/content/projects";
import { DeviceMockup } from "@/components/site/device-mockup";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="surface-card overflow-hidden">
      <div className="relative aspect-[4/3] bg-soft">
        {project.image ? <Image src={project.image.src} alt={project.image.alt} fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" /> : <DeviceMockup className="absolute inset-0 rounded-none" />}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between text-xs font-bold tracking-[.14em] text-eyebrow uppercase"><span>{project.category}</span><span>{project.year}</span></div>
        <h3 className="mt-3 text-xl font-bold text-ink">{project.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
      </div>
    </article>
  );
}
