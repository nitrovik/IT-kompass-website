"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Honeypot, SelectMenu, TextAreaField, TextField } from "@/components/forms/field";
import { SubmitButton } from "@/components/forms/submit-button";
import { TurnstileField } from "@/components/ui/turnstile";

const initial: ContactState = { ok: false, message: "" };
export const contactCategories = ["Fiber/WiFi", "Mobil", "IT support", "Utstyr", "Installasjoner", "Nettsider"] as const;

type Name = "category" | "name" | "email" | "message";
type Values = Record<Name, string>;
type Errors = Partial<Record<Name, string>>;
const ORDER: Name[] = ["category", "name", "email", "message"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Samme krav som serveren (app/actions/contact.ts), så feilene vises før skjemaet sendes */
function check(name: Name, value: string): string | undefined {
  const text = value.trim();
  if (name === "category") return text ? undefined : "Velg hva henvendelsen gjelder.";
  if (name === "name") return text.length >= 2 ? undefined : "Skriv inn navnet ditt.";
  if (name === "email") return !text ? "Skriv inn e-postadressen din." : EMAIL.test(text) ? undefined : "Skriv inn en gyldig e-postadresse.";
  return !text ? "Skriv kort hva du trenger hjelp med." : text.length >= 10 ? undefined : "Skriv litt mer om hva du trenger hjelp med.";
}

function focusFirst(form: HTMLFormElement | null, errors: Errors) {
  const first = ORDER.find((name) => errors[name]);
  if (first) form?.querySelector<HTMLElement>(`#kontakt-${first}`)?.focus();
}

/*
  Kontaktskjemaet. Sendes med Resend og er beskyttet av Turnstile og et usynlig felt (app/actions/contact.ts).
  Feltene sjekkes før sending; feil vises ved feltet og fokus flyttes til den første.
  Kvitteringen vises bare når serveren har bekreftet at meldingen er sendt.
*/
export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const [values, setValues] = useState<Values>({ category: "", name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [seen, setSeen] = useState(state);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Feil fra serveren vises ved feltene de gjelder
  if (state !== seen) {
    setSeen(state);
    if (state.fieldErrors) setErrors(state.fieldErrors);
  }

  useEffect(() => {
    if (state.ok) doneRef.current?.focus();
    else if (state.fieldErrors) focusFirst(formRef.current, state.fieldErrors);
  }, [state]);

  const update = (name: Name, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    // Etter første forsøk oppdateres feilmeldingen mens man retter
    if (tried || errors[name]) setErrors((current) => ({ ...current, [name]: check(name, value) }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const found: Errors = {};
    for (const name of ORDER) {
      const message = check(name, values[name]);
      if (message) found[name] = message;
    }
    setTried(true);
    setErrors(found);
    if (Object.keys(found).length) {
      event.preventDefault();
      focusFirst(event.currentTarget, found);
    }
  };

  if (state.ok) {
    return (
      <div ref={doneRef} className="form-success" role="status" tabIndex={-1}>
        <span className="form-success-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" width="22" height="22"><path d="M5.5 12.5l4.2 4.2 8.8-9.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <p className="form-success-title">Meldingen er sendt</p>
        <p className="form-success-text">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} onSubmit={onSubmit} noValidate className="contact-form">
      <SelectMenu id="kontakt-category" name="category" label="Hva gjelder det?" options={contactCategories} value={values.category} onChange={(value) => update("category", value)} placeholder="Velg kategori" required error={errors.category} />
      <div className="form-row">
        <TextField id="kontakt-name" name="name" label="Navn" value={values.name} onChange={(value) => update("name", value)} required placeholder="Ditt navn" autoComplete="name" error={errors.name} />
        <TextField id="kontakt-email" name="email" type="email" label="E-post" value={values.email} onChange={(value) => update("email", value)} required placeholder="din@epost.no" autoComplete="email" inputMode="email" error={errors.email} />
      </div>
      <TextAreaField id="kontakt-message" name="message" label="Melding" value={values.message} onChange={(value) => update("message", value)} required placeholder="Skriv kort hva du trenger hjelp med …" maxLength={5000} error={errors.message} />
      <Honeypot />
      <TurnstileField />
      {state.message && !state.fieldErrors ? (
        <p className="form-alert" role="alert">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4.6v4.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="8" cy="11.1" r=".9" fill="currentColor" /></svg>
          {state.message}
        </p>
      ) : null}
      <div className="form-actions">
        <SubmitButton pending={pending} />
        <p className="form-note">Vi bruker opplysningene til å svare deg. <Link href="/personvern">Personvern</Link></p>
      </div>
    </form>
  );
}
