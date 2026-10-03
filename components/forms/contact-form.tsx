"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Field, FormMessage, Honeypot, SelectField, TextareaField } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { TurnstileField } from "@/components/ui/turnstile";

const initial: ContactState = { ok: false, message: "" };
export const contactCategories = ["Fiber/WiFi", "Mobil", "IT support", "Utstyr", "Installasjoner", "Nettsider"] as const;

/* compact = forsidevarianten med kun de viktigste feltene. */
export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [state, action] = useActionState(submitContact, initial);

  if (state.ok) return <FormMessage ok>{state.message}</FormMessage>;

  return (
    <form action={action} className="relative grid gap-4">
      <SelectField label="Hva gjelder det?" name="category" required options={contactCategories} placeholder="Velg kategori" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Navn" name="name" required placeholder="Ditt navn" autoComplete="name" />
        <Field label="E-post" name="email" type="email" required placeholder="din@epost.no" autoComplete="email" />
      </div>
      {compact ? null : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Virksomhet" name="company" placeholder="Bedrift AS" autoComplete="organization" />
          <Field label="Telefon" name="phone" type="tel" placeholder="Telefonnummer" autoComplete="tel" />
        </div>
      )}
      <TextareaField label="Melding" name="message" required placeholder="Skriv kort hva du trenger hjelp med …" />
      <Honeypot />
      <TurnstileField />
      {state.message ? <FormMessage ok={false}>{state.message}</FormMessage> : null}
      <SubmitButton label="Send melding" className="w-full sm:w-auto" />
    </form>
  );
}
