"use client";

import { useActionState, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass } from "lucide-react";
import { submitWizard, type WizardState } from "@/app/actions/wizard";
import { getRecommendation, wizardSteps } from "@/content/wizard";
import { Field, FormMessage, Honeypot } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { TurnstileField } from "@/components/ui/turnstile";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SolutionWizard() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
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
        <div className="grid size-14 place-items-center rounded-full bg-[#e7f6ee] text-success"><Check aria-hidden="true" /></div>
        <h2 className="mt-6 text-3xl font-extrabold tracking-[-.03em] text-ink">Forespørselen er mottatt.</h2>
        <p role="status" className="mt-3 max-w-2xl leading-7 text-body">{state.message}</p>
      </div>
    );
  }

  const progress = showForm ? 100 : Math.round(((step + 1) / (total + 1)) * 100);

  return (
    <div className="surface-card overflow-hidden">
      <div className="h-1.5 bg-sky" aria-hidden="true"><div className="h-full bg-[linear-gradient(90deg,var(--color-brand),var(--color-brand-bright))] transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
      {showForm ? (
        <form action={action} className="relative grid gap-4 p-6 sm:p-10">
          <div>
            <p className="eyebrow">Siste steg</p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-extrabold tracking-[-.03em] text-ink outline-none">Hvor kan vi kontakte deg?</h2>
            <p className="mt-4 rounded-2xl border border-brand/20 bg-tile px-4 py-3 text-sm text-body">
              Anbefalt retning: <strong className="text-ink">{getRecommendation(values.need, values.employees)}</strong>
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
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            <button type="button" onClick={() => go(() => setShowForm(false))} className={buttonVariants({ variant: "secondary", size: "lg" })}><ArrowLeft size={17} aria-hidden="true" /> Tilbake</button>
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Steg {step + 1} av {total}</p>
          <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-extrabold tracking-[-.03em] text-ink outline-none">{current.title}</h2>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-tile text-brand" aria-hidden="true"><Compass size={22} /></span>
      </div>
      <fieldset className="mt-8">
        <legend className="sr-only">{current.title}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {current.options.map((option) => {
            const active = selected === option;
            return (
              <label key={option}
                className={cn("flex min-h-[60px] cursor-pointer items-center justify-between gap-3 rounded-2xl border p-5 text-[15px] font-bold text-ink transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand", active ? "border-brand bg-tile shadow-[0_0_0_3px_rgba(39,167,255,.15)]" : "border-line bg-white hover:border-[#acd2ef] hover:bg-soft")}>
                <input type="radio" className="sr-only" name={`veiviser-${current.key}`} value={option} checked={active} onChange={() => onSelect(current.key, option)} />
                {option}
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border", active ? "border-brand bg-brand text-white" : "border-line-strong")} aria-hidden="true">{active ? <Check size={14} strokeWidth={3} /> : null}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? <button type="button" onClick={onBack} className={buttonVariants({ variant: "secondary", size: "lg" })}><ArrowLeft size={17} aria-hidden="true" /> Tilbake</button> : <span className="text-sm text-muted">Du kan endre svarene underveis.</span>}
        <button type="button" disabled={!selected} onClick={onNext} className={buttonVariants({ size: "lg" })}>
          {step < total - 1 ? "Neste" : "Se anbefaling"} <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
