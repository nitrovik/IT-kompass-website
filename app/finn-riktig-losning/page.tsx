import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { SolutionWizard } from "@/components/forms/wizard";

export const metadata: Metadata = { title: "Finn riktig løsning", description: "Veiviser for å finne riktig IT- og telecomløsning for virksomheten din." };

export default function SolutionPage() {
  return <main id="main"><PageHero eyebrow="Veiviser" title="Finn riktig løsning." body="Svar på noen få spørsmål om behovet, virksomheten og hvor raskt det haster. Til slutt får du en konkret retning og en ferdig henvendelse."/><section className="section-pad"><div className="container-shell max-w-4xl"><SolutionWizard/></div></section></main>;
}
