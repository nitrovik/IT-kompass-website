"use server";

import { z } from "zod";
import { checkHuman, deliver, emailTable, type FormState } from "@/lib/forms";
import { getRecommendation } from "@/content/wizard";

const wizardSchema = z.object({
  need: z.string().trim().min(1, "Velg hva du trenger."),
  employees: z.string().trim().min(1, "Velg hvor mange dere er."),
  urgency: z.string().trim().min(1, "Velg når du trenger hjelp."),
  address: z.string().trim().min(3, "Skriv inn adresse eller sted."),
  name: z.string().trim().min(2, "Skriv inn navnet ditt."),
  company: z.string().trim().min(2, "Skriv inn virksomheten."),
  email: z.email("Skriv inn en gyldig e-postadresse."),
});

export type WizardState = FormState;

export async function submitWizard(_: WizardState, formData: FormData): Promise<WizardState> {
  if (String(formData.get("website") ?? "").trim()) return { ok: true, message: "Takk! Forespørselen er mottatt." };

  const parsed = wizardSchema.safeParse({
    need: formData.get("need"),
    employees: formData.get("employees"),
    urgency: formData.get("urgency"),
    address: formData.get("address"),
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Fyll ut alle feltene før du sender inn." };

  const blocked = await checkHuman(formData);
  if (blocked) return blocked;

  const data = parsed.data;
  const recommendation = getRecommendation(data.need, data.employees);
  return deliver(
    {
      subject: `Løsningsforespørsel – ${recommendation}`,
      replyTo: data.email,
      html: emailTable("Ny forespørsel fra veiviseren", [
        ["Anbefalt retning", recommendation],
        ["Behov", data.need],
        ["Antall ansatte", data.employees],
        ["Tidsramme", data.urgency],
        ["Adresse/sted", data.address],
        ["Navn", data.name],
        ["Virksomhet", data.company],
        ["E-post", data.email],
      ]),
    },
    `Takk! Vi har mottatt forespørselen med anbefalt retning «${recommendation}», og tar kontakt.`,
  );
}
