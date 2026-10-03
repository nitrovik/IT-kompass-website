import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { homeShowcase, homePackages } from "@/content/home";
import { buttonVariants } from "@/components/ui/button";

function DevicePair({ label }: { label: string }) {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#06111f] p-5">
      <div className="absolute inset-x-8 top-8 h-[210px] rounded-[1rem] border border-white/10 bg-[#0b1d30] p-2 shadow-[0_30px_50px_rgba(0,0,0,.32)]">
        <div className="h-full rounded-[.75rem] border border-white/8 bg-[linear-gradient(135deg,rgba(38,155,255,.28),rgba(9,23,39,.94)_50%)] p-5">
          <div className="h-2 w-24 rounded-full bg-white/15" />
          <div className="mt-6 h-3 w-40 rounded-full bg-white/10" />
          <div className="mt-2 h-3 w-32 rounded-full bg-white/8" />
          <div className="mt-8 h-16 rounded-xl border border-white/8 bg-black/10" />
        </div>
      </div>
      <div className="absolute bottom-4 right-6 h-[145px] w-[88px] rounded-[1rem] border border-white/12 bg-[#0b1d30] p-2 shadow-[0_24px_50px_rgba(0,0,0,.4)]">
        <div className="h-full rounded-[.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(38,155,255,.24),rgba(9,23,39,.96))] p-3">
          <div className="h-2 w-8 rounded-full bg-white/15" />
          <div className="mt-5 h-10 rounded-lg bg-white/8" />
          <div className="mt-3 h-2 w-10 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="absolute bottom-5 left-5 text-xs font-semibold text-white">{label}</div>
    </div>
  );
}

export function Showcase() {
  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-3">
        {homeShowcase.map((project) => (
          <article key={project.title} className="surface-card overflow-hidden rounded-[1.5rem]">
            <DevicePair label={project.motif} />
            <div className="p-6">
              <div className="text-xs font-bold uppercase tracking-[.16em] text-[#6EC5FF]">{project.category}</div>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-.04em]">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{project.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-start">
        <Link href="/prosjekter" className={buttonVariants({ variant: "outline", size: "lg" })}>Se prosjekter <ArrowUpRight size={17}/></Link>
      </div>

      <div className="mt-24 grid gap-5 lg:grid-cols-3">
        {homePackages.map((pack) => (
          <article key={pack.name} className={`rounded-[1.5rem] border p-7 ${pack.featured ? "border-[#269BFF]/45 bg-[#0d2035] shadow-[0_20px_70px_rgba(38,155,255,.12)]" : "border-white/10 bg-[#0a1828]"}`}>
            <div className="flex items-center justify-between"><span className="text-xl font-semibold">{pack.name}</span>{pack.featured ? <span className="rounded-full border border-[#269BFF]/30 bg-[#269BFF]/10 px-3 py-1 text-xs font-semibold text-[#8bd1ff]">Mest fleksibel</span> : null}</div>
            <p className="mt-4 min-h-[76px] text-sm leading-6 text-slate-400">{pack.summary}</p>
            <div className="mt-8 border-t border-white/8 pt-6 text-2xl font-semibold">{pack.price}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
