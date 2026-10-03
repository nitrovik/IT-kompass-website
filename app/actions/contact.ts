"use server";

import { z } from "zod";
import { validateTurnstile } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Skriv inn navnet ditt."),
  company: z.string().trim().min(2, "Skriv inn virksomheten."),
  email: z.email("Skriv inn en gyldig e-postadresse."),
  phone: z.string().trim().min(6, "Skriv inn et telefonnummer."),
  category: z.string().trim().min(1, "Velg en kategori."),
  message: z.string().trim().min(20, "Skriv litt mer om hva du trenger hjelp med."),
  turnstileToken: z.string().optional(),
  website: z.string().optional(),
});

export type ContactState = { ok: boolean; message: string };

export async function submitContact(_: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  if (String(raw.website ?? "").trim()) return { ok: true, message: "Takk. Henvendelsen er mottatt." };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Kontroller feltene og prøv igjen." };
  const validTurnstile = await validateTurnstile(parsed.data.turnstileToken);
  if (!validTurnstile) return { ok: false, message: "Bekreft at du er en ekte person og prøv igjen." };

  await sendContactEmail({
    subject: `Ny henvendelse – ${parsed.data.category}`,
    replyTo: parsed.data.email,
    html: `<h1>Ny henvendelse</h1><p><strong>Navn:</strong> ${escapeHtml(parsed.data.name)}</p><p><strong>Virksomhet:</strong> ${escapeHtml(parsed.data.company)}</p><p><strong>E-post:</strong> ${escapeHtml(parsed.data.email)}</p><p><strong>Telefon:</strong> ${escapeHtml(parsed.data.phone)}</p><p><strong>Kategori:</strong> ${escapeHtml(parsed.data.category)}</p><p><strong>Melding:</strong></p><p>${escapeHtml(parsed.data.message).replace(/\n/g, "<br>")}</p>`,
  });
  return { ok: true, message: "Takk. Vi har mottatt henvendelsen." };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
}
