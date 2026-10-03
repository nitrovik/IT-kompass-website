"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Field, SelectField, TextareaField } from "@/components/forms/field";
import { TurnstileField } from "@/components/ui/turnstile";
import { buttonVariants } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const initial: ContactState = { ok: false, message: "" };
function SubmitButton() { const { pending } = useFormStatus(); return <button type="submit" disabled={pending} className={buttonVariants({ size: "lg" })}>{pending ? "Sender …" : "Send henvendelse"}</button>; }

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initial);
  return <form action={action} className="grid gap-5">
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Navn" name="name" required placeholder="Navn"/><Field label="Virksomhet" name="company" required placeholder="Bedrift AS"/></div>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="E-post" name="email" type="email" required placeholder="navn@bedrift.no"/><Field label="Telefon" name="phone" type="tel" required placeholder="Telefonnummer"/></div>
    <SelectField label="Hva gjelder det?" name="category" required options={["Fiber/WiFi", "Mobil", "IT support", "Utstyr", "Installasjoner", "Nettsider"]}/>
    <TextareaField label="Fortell litt om behovet" name="message" required placeholder="Hva vil du ha hjelp med?"/>
    <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <TurnstileField />
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><SubmitButton/>{state.message ? <p role="status" className={state.ok ? "text-sm text-[#8cf0b9]" : "text-sm text-[#ff9aa6]"}>{state.message}</p> : null}</div>
  </form>;
}
