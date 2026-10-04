"use client";

import { useSearchParams } from "next/navigation";
import { SolutionWizard } from "@/components/forms/wizard";

/* Leser ?behov=… fra lenken (f.eks. fra forsiden) og starter veiviseren med svaret valgt. */
export function WizardFromParams() {
  const need = useSearchParams().get("behov") ?? undefined;
  return <SolutionWizard key={need ?? "start"} initialNeed={need} />;
}
