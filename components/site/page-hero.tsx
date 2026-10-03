import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { WordReveal } from "@/components/home/word-reveal";

export function PageHero({ eyebrow, title, body, cta }: { eyebrow: string; title: string; body: string; cta?: { href: string; label: string } }) {
  return (
    <section className="relative overflow-hidden border-b border-white/8 pt-36 sm:pt-44">
      <div className="grid-noise absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_65%_10%,rgba(38,155,255,.13),transparent_50%)]" aria-hidden="true" />
      <div className="container-shell relative z-10 section-pad !pt-0 !pb-20">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="display-text mt-6 max-w-5xl"><WordReveal lines={[title]} /></h1>
        <p className="body-lg mt-7 max-w-2xl">{body}</p>
        {cta ? <div className="mt-8"><Link href={cta.href} className={buttonVariants({ size: "lg" })}>{cta.label} <ArrowUpRight size={18}/></Link></div> : null}
      </div>
    </section>
  );
}
