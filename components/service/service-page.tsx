import Link from "next/link";
import { ArrowUpRight, Check, Compass } from "lucide-react";
import type { Service } from "@/content/services";
import { buttonVariants } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";

export function ServicePage({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <main id="main">
      <PageHero eyebrow={service.kicker} title={service.title} body={service.description} cta={{ href: "/kontakt", label: "Snakk med oss" }} />
      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <div className="grid size-16 place-items-center rounded-2xl border border-[#269BFF]/25 bg-[#269BFF]/10 text-[#6EC5FF]"><Icon size={27}/></div>
            <p className="mt-7 text-2xl leading-9 tracking-[-.03em] text-slate-200">{service.intro}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">{service.detailed.map((item) => <article key={item.title} className="surface-card rounded-[1.4rem] p-6"><h2 className="text-xl font-semibold tracking-[-.03em]">{item.title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{item.body}</p></article>)}</div>
        </div>
      </section>
      <section className="section-pad bg-[#050f1b]">
        <div className="container-shell">
          <SectionHeading eyebrow="Leveransen" title="Dette kan vi hjelpe deg med." />
          <div className="mt-10 grid gap-3 md:grid-cols-3">{service.bullets.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><Check size={18} className="text-[#6EC5FF]"/><div className="mt-4 font-semibold">{item}</div></div>)}</div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow="Slik kan det se ut" title="Fra behov til en løsning som er i drift." />
          <div className="mt-10 grid gap-3 sm:grid-cols-5">{service.process.map((step, index) => <div key={step} className="rounded-2xl border border-white/10 bg-[#0a1828] p-5"><div className="text-xs font-bold tracking-[.16em] text-[#6EC5FF]">0{index + 1}</div><div className="mt-8 text-sm font-semibold">{step}</div></div>)}</div>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row"><Link href="/finn-riktig-losning" className={buttonVariants({ size: "lg" })}>Finn riktig løsning <ArrowUpRight size={18}/></Link><Link href="/tjenester" className={buttonVariants({ variant: "outline", size: "lg" })}>Se alle tjenester</Link></div>
        </div>
      </section>
    </main>
  );
}
