import { Check } from "lucide-react";
import type { websitePackages } from "@/content/projects";

type Package = (typeof websitePackages)[number];

export function PackageCard({ pack }: { pack: Package }) {
  return <article className={`rounded-[1.5rem] border p-7 ${pack.featured ? "border-[#269BFF]/45 bg-[#0d2035]" : "border-white/10 bg-[#0a1828]"}`}>
    <div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-semibold">{pack.name}</h2>{pack.featured ? <span className="rounded-full border border-[#269BFF]/30 bg-[#269BFF]/10 px-3 py-1 text-xs text-[#8bd1ff]">Mest fleksibel</span> : null}</div>
    <p className="mt-4 min-h-[76px] text-sm leading-6 text-slate-400">{pack.description}</p>
    <div className="mt-6 grid gap-3 border-t border-white/8 pt-6">{pack.features.map((feature) => <div key={feature} className="flex gap-3 text-sm text-slate-300"><Check size={17} className="mt-0.5 shrink-0 text-[#6EC5FF]"/>{feature}</div>)}</div>
    <div className="mt-8 text-2xl font-semibold">{pack.price}</div>
  </article>;
}
