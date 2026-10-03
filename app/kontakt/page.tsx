import type { Metadata } from "next";
import { CalendarClock, MapPinned } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/config/site";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = { title: "Kontakt", description: "Kontakt IT Kompass AS om fiber, WiFi, mobil, IT support, utstyr, installasjoner og nettsider." };

export default function ContactPage() {
  return <main id="main">
    <PageHero eyebrow="Kontakt" title="Fortell oss hva du skal få på plass." body="Velg tema, beskriv behovet og legg inn kontaktinformasjonen din. Vi bruker henvendelsen til å finne riktig vei videre." />
    <section className="section-pad"><div className="container-shell grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-8"><ContactForm/></div><div className="grid gap-5">
      <div id="booking" className="rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-8"><CalendarClock className="text-[#6EC5FF]"/><h2 className="mt-6 text-2xl font-semibold">Bestill et møte</h2><p className="mt-3 text-sm leading-6 text-slate-400">Koble til Cal.com eller en annen møtebooking her når kalenderlenken er klar.</p>{site.bookingUrl ? <div className="mt-5 overflow-hidden rounded-2xl border border-white/8"><iframe src={site.bookingUrl} title="Bestill møte med IT Kompass" className="h-[480px] w-full bg-white" /></div> : <div className="mt-5 rounded-2xl border border-white/8 bg-white/[.025] p-4 text-sm text-slate-500">Møtebooking er klargjort. Legg inn <code>CAL_URL</code> via <code>NEXT_PUBLIC_CAL_URL</code> før publisering.</div>}</div>
      <div className="rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-8"><MapPinned className="text-[#6EC5FF]"/><h2 className="mt-6 text-2xl font-semibold">Området vi dekker</h2><p className="mt-3 text-sm leading-6 text-slate-400">Dekningsområdet er bevisst ikke oppdiktet. Når området er bekreftet, fyller vi inn kartdata her uten å endre komponenten.</p><div className="mt-6 grid h-64 place-items-center overflow-hidden rounded-2xl border border-white/8 bg-[radial-gradient(circle_at_50%_50%,rgba(38,155,255,.18),transparent_45%),linear-gradient(135deg,#0a1828,#07111f)]"><div className="text-center"><div className="mx-auto grid size-14 place-items-center rounded-full border border-[#269BFF]/30 bg-[#269BFF]/10 text-[#6EC5FF]"><MapPinned size={22}/></div><div className="mt-4 text-xs uppercase tracking-[.16em] text-slate-500">Kartplassholder</div></div></div></div>
    </div></div></section>
  </main>;
}
