import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FiberField } from "@/components/site/fiber-field";
import { WordReveal } from "@/components/home/word-reveal";
import { cn } from "@/lib/utils";

type Cta = { href: string; label: string };

export function PageHero({ eyebrow, title, body, cta, secondaryCta }: { eyebrow: string; title: string; body: string; cta?: Cta; secondaryCta?: Cta }) {
  return (
    <section className="hero-surface relative overflow-hidden border-b border-line">
      <FiberField variant="hero" className="opacity-40 lg:opacity-70" />
      <div className="container-shell relative z-10 py-16 sm:py-20 lg:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title mt-4 max-w-4xl text-ink"><WordReveal lines={[title]} /></h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-[1.65] text-body sm:text-lg">{body}</p>
        {cta || secondaryCta ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {cta ? <Link href={cta.href} className={buttonVariants({ size: "lg" })}>{cta.label} <ArrowRight size={17} aria-hidden="true" /></Link> : null}
            {secondaryCta ? <Link href={secondaryCta.href} className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>{secondaryCta.label}</Link> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
