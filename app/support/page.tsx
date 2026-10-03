import type { Metadata } from "next";
import { ArrowDownToLine, ExternalLink, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { SupportForm } from "@/components/forms/support-form";
import { StatusBoard } from "@/components/support/status-board";
import { site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { getStatusServices } from "@/lib/status";

export const metadata: Metadata = { title: "Support", description: "Meld inn en IT-supportsak, få fjernhjelp og se driftsstatus." };

export default async function SupportPage() {
  const services = await getStatusServices();
  return <main id="main">
    <PageHero eyebrow="Support" title="Når noe stopper, skal veien videre være kort." body="Meld inn saken med kategori, prioritet, beskrivelse og eventuelt vedlegg. Du kan også finne veien til fjernhjelp og driftsstatus." />
    <section className="section-pad"><div className="container-shell grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div><SupportForm/></div><div className="grid gap-5">
      <div className="rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-8"><LifeBuoy className="text-[#6EC5FF]"/><h2 className="mt-6 text-2xl font-semibold">Fjernhjelp</h2><p className="mt-3 text-sm leading-6 text-slate-400">Når vi skal hjelpe deg på skjermen, bruker vi et fjernhjelpsverktøy. Lenken legges inn når løsningen er valgt og klar.</p>{site.remoteHelpUrl ? <a href={site.remoteHelpUrl} target="_blank" rel="noreferrer" className={`${buttonVariants({ size: "lg" })} mt-6`}>Last ned fjernhjelp <ArrowDownToLine size={17}/></a> : <span className="mt-6 inline-flex rounded-xl border border-white/10 bg-white/[.025] px-4 py-3 text-sm text-slate-500">Nedlastingslenke konfigureres før publisering</span>}</div>
      <div className="rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-8"><SectionHeading eyebrow="Driftsstatus" title="Se hva som skjer." body="Statusflaten er klar for live data fra et eksternt driftsstatussystem."/><div className="mt-6"><StatusBoard services={services}/></div><Link href="#status" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">Detaljer <ExternalLink size={15}/></Link></div>
    </div></div></section>
    <section id="status" className="section-pad border-t border-white/8 bg-[#050f1b]"><div className="container-shell"><SectionHeading eyebrow="Status" title="Status for tjenestene." body="I denne versjonen er status manuelt markert som ikke koblet. Når leverandørens status-API er tilgjengelig, kan denne flaten kobles til uten at designsystemet endres."/><div className="mt-10 max-w-3xl"><StatusBoard services={services}/></div></div></section>
  </main>;
}
