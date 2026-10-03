import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { SolutionWizard } from "@/components/forms/wizard";

export const metadata: Metadata = {
  title: "Finn riktig løsning",
  description: "Svar på tre korte spørsmål og få en anbefalt retning for IT og telecom i virksomheten din.",
  alternates: { canonical: "/finn-riktig-losning" },
};

export default function SolutionPage() {
  return (
    <main id="main">
      <PageHero eyebrow="Veiviser" title="Finn riktig løsning." body="Svar på tre korte spørsmål om behovet, virksomheten og tidsrammen. Til slutt får du en anbefalt retning, og vi tar kontakt." />
      <section className="section-pad bg-soft">
        <div className="container-shell max-w-4xl"><SolutionWizard /></div>
      </section>
    </main>
  );
}
