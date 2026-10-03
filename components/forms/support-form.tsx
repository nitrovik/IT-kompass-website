"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitSupport, type SupportState } from "@/app/actions/support";
import { Field, SelectField, TextareaField } from "@/components/forms/field";
import { TurnstileField } from "@/components/ui/turnstile";
import { buttonVariants } from "@/components/ui/button";

const initial: SupportState = { ok: false, message: "" };
function SubmitButton() { const { pending } = useFormStatus(); return <button type="submit" disabled={pending} className={buttonVariants({ size: "lg" })}>{pending ? "Sender …" : "Send inn sak"}</button>; }

export function SupportForm() {
  const [state, action] = useActionState(submitSupport, initial);
  return <form action={action} encType="multipart/form-data" className="grid gap-5">
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Navn" name="name" required placeholder="Navn"/><Field label="Virksomhet" name="company" required placeholder="Bedrift AS"/></div>
    <Field label="E-post" name="email" type="email" required placeholder="navn@bedrift.no"/>
    <div className="grid gap-5 sm:grid-cols-2"><SelectField label="Kategori" name="category" required options={["WiFi", "Fiber og telecom", "IT support", "Utstyr", "Nettsider", "Annet"]}/><SelectField label="Prioritet" name="priority" required options={["Lav", "Normal", "Høy", "Kritisk"]}/></div>
    <TextareaField label="Beskrivelse" name="description" required placeholder="Hva har skjedd, hvem gjelder det, og hva er viktigst å få løst?"/>
    <label className="grid gap-2 text-sm font-medium text-slate-200"><span>Vedlegg</span><input className="rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm" type="file" name="attachment" accept="image/png,image/jpeg,application/pdf,text/plain"/><span className="text-xs font-normal text-slate-500">PNG, JPG, PDF eller TXT. Maks 10 MB.</span></label>
    <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <TurnstileField />
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><SubmitButton/>{state.message ? <p role="status" className={state.ok ? "text-sm text-[#8cf0b9]" : "text-sm text-[#ff9aa6]"}>{state.message}</p> : null}</div>
  </form>;
}
