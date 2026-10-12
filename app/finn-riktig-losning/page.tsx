import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { PageHero } from "@/components/site/page-hero";
import { SolutionWizard } from "@/components/forms/wizard";
import { WizardFromParams } from "@/components/forms/wizard-from-params";

export const metadata: Metadata = pageMetadata({ title: "Finn riktig løsning", description: "Svar på tre spørsmål og få en anbefaling for IT og telecom i bedriften.", path: "/finn-riktig-losning" });

export default function SolutionPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero crumbs={[{ href: "/finn-riktig-losning", label: "Finn riktig løsning" }]} eyebrow="Veiviser" title="Finn riktig løsning." body="Svar på tre spørsmål. Du får en anbefaling, og vi tar kontakt." />
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
