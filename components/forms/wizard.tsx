"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass } from "lucide-react";
import { useActionState } from "react";
import { submitWizard, type WizardState } from "@/app/actions/wizard";
import { TurnstileField } from "@/components/ui/turnstile";
import { Field } from "@/components/forms/field";
import { buttonVariants } from "@/components/ui/button";

const steps = [
  { key: "need", title: "Hva trenger du?", options: ["WiFi", "Fiber og telecom", "IT support", "Nettsider", "Vet ikke ennå"] },
  { key: "employees", title: "Hvor mange ansatte er dere?", options: ["1–5", "6–20", "21–50", "51+"] },
  { key: "urgency", title: "Hvor raskt trenger du hjelp?", options: ["Så snart som mulig", "Denne måneden", "Vi planlegger", "Vet ikke ennå"] },
] as const;

export function SolutionWizard() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [state, action] = useActionState<WizardState, FormData>(submitWizard, { ok: false, message: "" });
  const current = steps[step];
  const selected = values[current.key] ?? "";

  if (state.ok) return <div className="rounded-[1.6rem] border border-[#269BFF]/25 bg-[#0a1828] p-8 sm:p-12"><div className="grid size-14 place-items-center rounded-full border border-[#269BFF]/25 bg-[#269BFF]/10 text-[#6EC5FF]"><Check/></div><h2 className="mt-7 text-3xl font-semibold">Forespørselen er mottatt.</h2><p className="mt-4 max-w-2xl leading-7 text-slate-400">{state.message}</p></div>;

  if (showForm) return <form action={action} className="grid gap-5 rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-10">
    <div><div className="eyebrow">Siste steg</div><h2 className="mt-3 text-3xl font-semibold">Hvor kan vi kontakte deg?</h2><p className="mt-3 text-slate-400">Anbefalt retning: <span className="text-white">{recommendation(values.need, values.employees)}</span></p></div>
    <input type="hidden" name="need" value={values.need ?? ""}/><input type="hidden" name="employees" value={values.employees ?? ""}/><input type="hidden" name="urgency" value={values.urgency ?? ""}/><input type="hidden" name="address" value={values.address ?? ""}/>
    <Field label="Adresse" name="address" required defaultValue={values.address} placeholder="Adresse eller sted"/>
    <div className="grid gap-5 sm:grid-cols-2"><Field label="Navn" name="name" required placeholder="Navn"/><Field label="Virksomhet" name="company" required placeholder="Bedrift AS"/></div>
    <Field label="E-post" name="email" type="email" required placeholder="navn@bedrift.no"/>
    <TurnstileField />
    <div className="flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => setShowForm(false)} className={buttonVariants({ variant: "outline", size: "lg" })}><ArrowLeft size={17}/> Tilbake</button><button type="submit" className={buttonVariants({ size: "lg" })}>Send forespørsel <ArrowRight size={17}/></button></div>
    {state.message ? <p role="status" className="text-sm text-[#ff9aa6]">{state.message}</p> : null}
  </form>;

  return <div className="rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-10">
    <div className="flex items-center justify-between gap-4"><div><div className="eyebrow">Steg {step + 1} av {steps.length}</div><h2 className="mt-3 text-3xl font-semibold">{current.title}</h2></div><Compass className="text-[#269BFF]"/></div>
    <div className="mt-8 grid gap-3 sm:grid-cols-2">{current.options.map((option) => <button key={option} type="button" onClick={() => setValues((v) => ({ ...v, [current.key]: option }))} className={`rounded-2xl border p-5 text-left text-sm font-semibold transition ${selected === option ? "border-[#269BFF]/50 bg-[#269BFF]/10 text-white" : "border-white/10 bg-white/[.02] text-slate-300 hover:border-white/20"}`}><span className="flex items-center justify-between gap-3">{option}{selected === option ? <Check size={17} className="text-[#6EC5FF]"/> : null}</span></button>)}</div>
    <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/8 pt-6 sm:flex-row"><span className="text-sm text-slate-500">Du kan endre svarene dine.</span><button type="button" disabled={!selected} onClick={() => step < steps.length - 1 ? setStep((s) => s + 1) : setShowForm(true)} className={buttonVariants({ size: "lg" })}>{step < steps.length - 1 ? "Neste" : "Se anbefaling"} <ArrowRight size={17}/></button></div>
  </div>;
}

function recommendation(need?: string, employees?: string) {
  if (need === "Nettsider") return employees === "1–5" ? "Nettsider – Start" : "Nettsider – Pro";
  if (need === "WiFi") return "WiFi – kartlegging og prosjektering";
  if (need === "Fiber og telecom") return "Fiber og telecom – behovskartlegging";
  if (need === "IT support") return "IT support – drift og brukerstøtte";
  return "Et avklaringsmøte om IT og telecom";
}
