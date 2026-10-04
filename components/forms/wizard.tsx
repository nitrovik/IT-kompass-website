"use client";

import { useActionState, useRef, useState } from "react";
import { submitWizard, type WizardState } from "@/app/actions/wizard";
import { getRecommendation, wizardSteps } from "@/content/wizard";
import { Field, FormMessage, Honeypot } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { TurnstileField } from "@/components/ui/turnstile";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

const railLabels = ["Behov", "Størrelse", "Tidsramme", "Kontakt"];

export function SolutionWizard({ initialNeed }: { initialNeed?: string }) {
  const validNeed = initialNeed && (wizardSteps[0].options as readonly string[]).includes(initialNeed) ? initialNeed : undefined;
  const [step, setStep] = useState(validNeed ? 1 : 0);
  const [values, setValues] = useState<Record<string, string>>(validNeed ? { need: validNeed } : {});
  const [showForm, setShowForm] = useState(false);
  const [state, action] = useActionState<WizardState, FormData>(submitWizard, { ok: false, message: "" });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = wizardSteps.length;

  // Flytt fokus til ny overskrift slik at skjermlesere og tastatur følger med.
  const go = (next: () => void) => {
    next();
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  if (state.ok) {
    return (
      <div className="surface-card p-8 sm:p-12">
        <div className="grid size-14 place-items-center rounded-full bg-[#e7f6ee] text-success" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="m5 11.5 4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h2 className="card-title mt-6 text-3xl text-ink">Forespørselen er mottatt.</h2>
        <p role="status" className="mt-3 max-w-2xl leading-7 text-body">{state.message}</p>
      </div>
    );
  }

  const position = showForm ? total : step;

  return (
    <div className="surface-card grid overflow-hidden lg:grid-cols-[220px_1fr]">
      {/* Framdrift */}
      <aside className="border-b border-line bg-soft px-6 py-5 lg:border-r lg:border-b-0 lg:px-7 lg:py-9" aria-label="Framdrift">
        <ol className="flex gap-5 overflow-x-auto lg:flex-col lg:gap-0">
          {railLabels.map((label, i) => {
            const state = i < position ? "done" : i === position ? "current" : "todo";
            return (
              <li key={label} aria-current={state === "current" ? "step" : undefined} className="relative flex shrink-0 items-center gap-3 lg:pb-8 lg:last:pb-0">
                {i < railLabels.length - 1 ? <span aria-hidden="true" className={cn("absolute top-8 left-[13px] hidden h-[calc(100%-26px)] w-px lg:block", i < position ? "bg-brand" : "bg-line-strong")} /> : null}
                <span className={cn("relative grid size-[27px] place-items-center rounded-full border text-xs font-semibold tabular transition-colors duration-500",
                  state === "done" && "border-brand bg-brand text-white",
                  state === "current" && "border-brand bg-white text-brand shadow-[0_0_0_5px_rgba(42,166,255,.15)]",
                  state === "todo" && "border-line-strong bg-white text-faint")}>
                  {state === "done" ? <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="m2 6.3 2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg> : i + 1}
                </span>
                <span className={cn("text-sm font-medium", state === "todo" ? "text-muted" : "text-ink")}>{label}<span className="sr-only">{state === "done" ? " (fullført)" : state === "current" ? " (nåværende steg)" : ""}</span></span>
              </li>
            );
          })}
        </ol>
      </aside>

      {showForm ? (
        <form action={action} className="relative grid gap-4 p-6 sm:p-10">
          <div>
            <p className="eyebrow">Siste steg</p>
            <h2 ref={headingRef} tabIndex={-1} className="card-title mt-4 text-[30px] leading-tight text-ink outline-none">Hvor kan vi kontakte deg?</h2>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-brand/20 bg-tile px-4 py-3.5 text-sm text-body">
              <span className="font-medium">Anbefalt retning:</span> <strong className="font-semibold text-ink">{getRecommendation(values.need, values.employees)}</strong>
            </p>
          </div>
          {wizardSteps.map((item) => <input key={item.key} type="hidden" name={item.key} value={values[item.key] ?? ""} />)}
          <Field label="Adresse eller sted" name="address" required placeholder="Gateadresse eller sted" autoComplete="street-address" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Navn" name="name" required placeholder="Ditt navn" autoComplete="name" />
            <Field label="Virksomhet" name="company" required placeholder="Bedrift AS" autoComplete="organization" />
          </div>
          <Field label="E-post" name="email" type="email" required placeholder="din@epost.no" autoComplete="email" />
          <Honeypot />
          <TurnstileField />
          {state.message ? <FormMessage ok={false}>{state.message}</FormMessage> : null}
          <div className="mt-2 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => go(() => setShowForm(false))} className={buttonVariants({ variant: "secondary", size: "lg" })}><Arrow className="rotate-180" /> Tilbake</button>
            <SubmitButton label="Send forespørsel" />
          </div>
        </form>
      ) : (
        <WizardStep step={step} total={total} values={values} headingRef={headingRef}
          onSelect={(key, option) => setValues((current) => ({ ...current, [key]: option }))}
          onBack={() => go(() => setStep((current) => current - 1))}
          onNext={() => go(() => (step < total - 1 ? setStep((current) => current + 1) : setShowForm(true)))}
        />
      )}
    </div>
  );
}

function WizardStep({ step, total, values, headingRef, onSelect, onBack, onNext }: {
  step: number; total: number; values: Record<string, string>; headingRef: React.RefObject<HTMLHeadingElement | null>;
  onSelect: (key: string, option: string) => void; onBack: () => void; onNext: () => void;
}) {
  const current = wizardSteps[step];
  const selected = values[current.key] ?? "";
  return (
    <div className="p-6 sm:p-10">
      <p className="eyebrow">Steg {step + 1} av {total}</p>
      <h2 ref={headingRef} tabIndex={-1} className="card-title mt-4 text-[30px] leading-tight text-ink outline-none">{current.title}</h2>
      <fieldset className="mt-8">
        <legend className="sr-only">{current.title}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {current.options.map((option) => {
            const active = selected === option;
            return (
              <label key={option}
                className={cn("group flex min-h-[64px] cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-white p-5 text-[15px] font-semibold text-ink transition-[border-color,box-shadow,background-color,transform] duration-300 hover:-translate-y-px has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand",
                  active ? "border-brand bg-tile shadow-[0_0_0_4px_rgba(42,166,255,.14)]" : "border-line hover:border-[#acd2ef] hover:shadow-[0_12px_24px_-16px_rgba(14,39,71,.35)]")}>
                <input type="radio" className="sr-only" name={`veiviser-${current.key}`} value={option} checked={active} onChange={() => onSelect(current.key, option)} />
                {option}
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border transition-colors", active ? "border-brand bg-brand text-white" : "border-line-strong group-hover:border-[#9fc0e0]")} aria-hidden="true">
                  {active ? <svg width="11" height="11" viewBox="0 0 12 12"><path d="m2 6.3 2.6 2.6L10 3.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? <button type="button" onClick={onBack} className={buttonVariants({ variant: "secondary", size: "lg" })}><Arrow className="rotate-180" /> Tilbake</button> : <span className="text-sm text-muted">Du kan endre svarene underveis.</span>}
        <button type="button" disabled={!selected} onClick={onNext} className={buttonVariants({ size: "lg" })}>
          {step < total - 1 ? "Neste" : "Se anbefaling"} <Arrow />
        </button>
      </div>
    </div>
  );
}
