"use server";

import { z } from "zod";
import { checkHuman, deliver, emailTable, type FormState } from "@/lib/forms";
import { MAX_ATTACHMENT_MB } from "@/lib/limits";

const allowedTypes = new Set(["image/png", "image/jpeg", "application/pdf", "text/plain"]);

const supportSchema = z.object({
  name: z.string().trim().min(2, "Skriv inn navnet ditt."),
  email: z.email("Skriv inn en gyldig e-postadresse."),
  company: z.string().trim().min(2, "Skriv inn virksomheten."),
  category: z.string().trim().min(1, "Velg en kategori."),
  priority: z.string().trim().min(1, "Velg prioritet."),
  description: z.string().trim().min(10, "Beskriv saken litt mer detaljert.").max(5000),
});

export type SupportState = FormState;

export async function submitSupport(_: SupportState, formData: FormData): Promise<SupportState> {
  if (String(formData.get("website") ?? "").trim()) return { ok: true, message: "Takk! Saken er registrert." };

  const parsed = supportSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    category: formData.get("category"),
    priority: formData.get("priority"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Kontroller feltene og prøv igjen." };

  const file = formData.get("attachment");
  let attachments: { filename: string; content: Buffer }[] | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_ATTACHMENT_MB * 1024 * 1024) return { ok: false, message: `Vedlegget må være mindre enn ${MAX_ATTACHMENT_MB} MB.` };
    if (!allowedTypes.has(file.type)) return { ok: false, message: "Tillatte vedlegg er PNG, JPG, PDF og TXT." };
    attachments = [{ filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "_"), content: Buffer.from(await file.arrayBuffer()) }];
  }

  const blocked = await checkHuman(formData);
  if (blocked) return blocked;

  const data = parsed.data;
  return deliver(
    {
      subject: `Supportsak – ${data.category} – ${data.priority}`,
      replyTo: data.email,
      attachments,
      html: emailTable("Ny supportsak fra nettsiden", [
        ["Prioritet", data.priority],
        ["Kategori", data.category],
        ["Navn", data.name],
        ["Virksomhet", data.company],
        ["E-post", data.email],
        ["Beskrivelse", data.description],
        ["Vedlegg", attachments?.[0]?.filename],
      ]),
    },
    "Takk! Saken er sendt inn, og vi følger den opp.",
  );
}
