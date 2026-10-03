import type { Metadata } from "next";
import { privacySections } from "@/content/legal";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = { title: "Personvern", description: "Informasjon om hvordan IT Kompass AS behandler personopplysninger på nettstedet." };

export default function PrivacyPage() {
  return <main id="main"><PageHero eyebrow="Personvern" title="Personvern skal være forståelig." body="Her beskriver vi hvordan nettstedet er lagt opp for å behandle opplysninger på en ryddig og personvernvennlig måte."/><section className="section-pad"><div className="container-shell max-w-4xl grid gap-4">{privacySections.map((section) => <article key={section.title} className="surface-card rounded-[1.4rem] p-6 sm:p-8"><h2 className="text-2xl font-semibold tracking-[-.03em]">{section.title}</h2><p className="mt-4 leading-7 text-slate-400">{section.body}</p></article>)}</div></section></main>;
}
