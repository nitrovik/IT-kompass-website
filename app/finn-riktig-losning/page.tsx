import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { PageHero } from "@/components/site/page-hero";
import { SolutionWizard } from "@/components/forms/wizard";
import { WizardFromParams } from "@/components/forms/wizard-from-params";

export const metadata: Metadata = pageMetadata({ title: "Finn riktig løsning", description: "Svar på tre korte spørsmål og få en anbefalt retning for IT og telecom i virksomheten din.", path: "/finn-riktig-losning" });

export default function SolutionPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/finn-riktig-losning", label: "Finn riktig løsning" }]} eyebrow="Veiviser" title="Finn riktig løsning." body="Svar på tre korte spørsmål om behovet, virksomheten og tidsrammen. Til slutt får du en anbefalt retning, og vi tar kontakt." />
      <section className="section-pad bg-soft">
        <div className="container-shell max-w-5xl">
          {/* Lenker fra forsiden kan forhåndsvelge første svar (?behov=…) */}
          <Suspense fallback={<SolutionWizard />}>
            <WizardFromParams />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
