"use client";

import { useActionState } from "react";
import { submitSupport, type SupportState } from "@/app/actions/support";
import { Field, FormMessage, Honeypot, SelectField, TextareaField } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { TurnstileField } from "@/components/ui/turnstile";
import { MAX_ATTACHMENT_MB } from "@/lib/limits";

const initial: SupportState = { ok: false, message: "" };

export function SupportForm() {
  const [state, action] = useActionState(submitSupport, initial);

  if (state.ok) return <FormMessage ok>{state.message}</FormMessage>;

  return (
    <form action={action} className="relative grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Navn" name="name" required placeholder="Ditt navn" autoComplete="name" />
        <Field label="Virksomhet" name="company" required placeholder="Bedrift AS" autoComplete="organization" />
      </div>
      <Field label="E-post" name="email" type="email" required placeholder="din@epost.no" autoComplete="email" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Kategori" name="category" required options={["WiFi", "Fiber og telecom", "IT support", "Utstyr", "Nettsider", "Annet"]} />
        <SelectField label="Prioritet" name="priority" required options={["Lav", "Normal", "Høy", "Kritisk"]} />
      </div>
      <TextareaField label="Beskrivelse" name="description" required placeholder="Hva har skjedd, hvem gjelder det, og hva er viktigst å få løst?" />
      <label className="grid gap-1.5 text-[13px] font-bold text-[#38536f]">
        <span>Vedlegg <span className="font-medium text-muted">(valgfritt)</span></span>
        <input className="form-control text-sm file:mr-3 file:rounded-full file:border-0 file:bg-tile file:px-3 file:py-1.5 file:text-[13px] file:font-bold file:text-brand" type="file" name="attachment" accept="image/png,image/jpeg,application/pdf,text/plain" aria-describedby="vedlegg-hjelp" />
        <span id="vedlegg-hjelp" className="text-xs font-normal text-muted">PNG, JPG, PDF eller TXT. Maks {MAX_ATTACHMENT_MB} MB.</span>
      </label>
      <Honeypot />
      <TurnstileField />
      {state.message ? <FormMessage ok={false}>{state.message}</FormMessage> : null}
      <SubmitButton label="Send inn sak" className="w-full sm:w-auto" />
    </form>
  );
}
