"use server";

import { z } from "zod";
import { validateTurnstile } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/email";

const supportSchema = z.object({
  name: z.string().trim().min(2, "Skriv inn navnet ditt."),
  email: z.email("Skriv inn en gyldig e-postadresse."),
  company: z.string().trim().min(2, "Skriv inn virksomheten."),
  category: z.string().trim().min(1, "Velg en kategori."),
  priority: z.string().trim().min(1, "Velg prioritet."),
  description: z.string().trim().min(20, "Beskriv saken litt mer detaljert."),
  turnstileToken: z.string().optional(),
  website: z.string().optional(),
});

export type SupportState = { ok: boolean; message: string };

export async function submitSupport(_: SupportState, formData: FormData): Promise<SupportState> {
  const raw = Object.fromEntries(formData.entries());
  if (String(raw.website ?? "").trim()) return { ok: true, message: "Saken er registrert." };
  const parsed = supportSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Kontroller feltene og prøv igjen." };
  const tokenValid = await validateTurnstile(parsed.data.turnstileToken);
  if (!tokenValid) return { ok: false, message: "Bekreft at du er en ekte person og prøv igjen." };

  const file = formData.get("attachment");
  let attachments: { filename: string; content: Buffer }[] | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) return { ok: false, message: "Vedlegget må være mindre enn 10 MB." };
    const allowed = new Set(["image/png", "image/jpeg", "application/pdf", "text/plain"]);
    if (!allowed.has(file.type)) return { ok: false, message: "Tillatte vedlegg er PNG, JPG, PDF og TXT." };
    attachments = [{ filename: file.name.replace(/[^a-zA-Z0-9._-]/g, "_"), content: Buffer.from(await file.arrayBuffer()) }];
  }

  await sendContactEmail({
    subject: `Supportsak – ${parsed.data.category} – ${parsed.data.priority}`,
    replyTo: parsed.data.email,
    attachments,
    html: `<h1>Ny supportsak</h1><p><strong>Navn:</strong> ${escapeHtml(parsed.data.name)}</p><p><strong>Virksomhet:</strong> ${escapeHtml(parsed.data.company)}</p><p><strong>E-post:</strong> ${escapeHtml(parsed.data.email)}</p><p><strong>Kategori:</strong> ${escapeHtml(parsed.data.category)}</p><p><strong>Prioritet:</strong> ${escapeHtml(parsed.data.priority)}</p><p><strong>Beskrivelse:</strong></p><p>${escapeHtml(parsed.data.description).replace(/\n/g, "<br>")}</p>`,
  });
  return { ok: true, message: "Takk. Saken er sendt inn." };
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char); }
