import { ArrowUpRight, Smartphone } from "lucide-react";
import Link from "next/link";
import type { projects } from "@/content/projects";

type Project = (typeof projects)[number];

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="surface-card overflow-hidden rounded-[1.6rem]">
      <div className="placeholder-frame h-[340px] p-5" aria-label="Bildeplassholder. Sett inn ekte prosjektbilde før publisering.">
        <div className="absolute inset-x-10 top-10 h-[215px] rounded-xl border border-white/10 bg-[#102238] p-2 shadow-[0_30px_60px_rgba(0,0,0,.35)]">
          <div className="h-full rounded-lg border border-white/8 bg-[linear-gradient(135deg,rgba(38,155,255,.22),rgba(9,23,39,.95))] p-6">
            <div className="text-xs font-bold uppercase tracking-[.16em] text-[#6EC5FF]">Ekte prosjektbilde</div>
            <div className="mt-12 max-w-[70%] text-lg font-semibold">Motiv: {project.title}</div>
          </div>
        </div>
        <div className="absolute bottom-6 right-7 flex size-24 flex-col items-center justify-center rounded-[1rem] border border-white/10 bg-[#0b1d30] p-2 shadow-xl">
          <Smartphone size={17} className="text-[#6EC5FF]" />
          <span className="mt-2 text-[9px] uppercase tracking-[.16em] text-slate-500">Mobil</span>
        </div>
        <div className="absolute bottom-6 left-6 text-xs text-slate-400">Plassholder for ekte foto</div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[.14em] text-[#6EC5FF]"><span>{project.category}</span><span>{project.year}</span></div>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-.04em]">{project.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">{project.description}</p>
        <Link href="/kontakt" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#8bd1ff]">Ta prosjektpraten <ArrowUpRight size={16}/></Link>
      </div>
    </article>
  );
}
