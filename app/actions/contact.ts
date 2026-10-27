"use server";

import { z } from "zod";
import { checkHuman, deliver, emailTable, type FormState } from "@/lib/forms";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Skriv inn navnet ditt."),
  email: z.email("Skriv inn en gyldig e-postadresse."),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
  category: z.string().trim().min(1, "Velg hva henvendelsen gjelder."),
  message: z.string().trim().min(10, "Skriv litt mer om hva du trenger hjelp med.").max(5000),
});

export type ContactState = FormState;

export async function submitContact(_: ContactState, formData: FormData): Promise<ContactState> {
  // Honningfelle: usynlig felt som bare roboter fyller ut.
  if (String(formData.get("website") ?? "").trim()) return { ok: true, message: "Takk! Vi har mottatt henvendelsen." };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    category: formData.get("category"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    // Én melding per felt, så skjemaet kan vise feilen ved feltet den gjelder
    const fieldErrors: NonNullable<ContactState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if ((field === "category" || field === "name" || field === "email" || field === "message") && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Kontroller feltene og prøv igjen.", fieldErrors };
  }

  const blocked = await checkHuman(formData);
  if (blocked) return blocked;

  const data = parsed.data;
  return deliver(
    {
      subject: `Ny henvendelse – ${data.category}`,
      replyTo: data.email,
      html: emailTable("Ny henvendelse fra nettsiden", [
        ["Kategori", data.category],
        ["Navn", data.name],
        ["Virksomhet", data.company],
        ["E-post", data.email],
        ["Telefon", data.phone],
        ["Melding", data.message],
      ]),
    },
    "Takk! Vi har mottatt henvendelsen og tar kontakt.",
  );
}
