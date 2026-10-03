"use server";

import { z } from "zod";
import { validateTurnstile } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/email";

const wizardSchema = z.object({
  need: z.string().trim().min(1),
  employees: z.string().trim().min(1),
  address: z.string().trim().min(3),
  urgency: z.string().trim().min(1),
  name: z.string().trim().min(2),
  company: z.string().trim().min(2),
  email: z.email(),
  turnstileToken: z.string().optional(),
});

export type WizardState = { ok: boolean; message: string };

export async function submitWizard(_: WizardState, formData: FormData): Promise<WizardState> {
  const parsed = wizardSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "Fyll ut alle feltene før du sender inn." };
  const tokenValid = await validateTurnstile(parsed.data.turnstileToken);
  if (!tokenValid) return { ok: false, message: "Bekreft at du er en ekte person og prøv igjen." };
  const recommendation = getRecommendation(parsed.data.need, parsed.data.employees);
  await sendContactEmail({
    subject: `Løsningsforespørsel – ${recommendation.title}`,
    replyTo: parsed.data.email,
    html: `<h1>Løsningsforespørsel</h1><p><strong>Anbefaling:</strong> ${escapeHtml(recommendation.title)}</p><p><strong>Behov:</strong> ${escapeHtml(parsed.data.need)}</p><p><strong>Ansatte:</strong> ${escapeHtml(parsed.data.employees)}</p><p><strong>Adresse:</strong> ${escapeHtml(parsed.data.address)}</p><p><strong>Haster:</strong> ${escapeHtml(parsed.data.urgency)}</p><p><strong>Navn:</strong> ${escapeHtml(parsed.data.name)}</p><p><strong>Virksomhet:</strong> ${escapeHtml(parsed.data.company)}</p><p><strong>E-post:</strong> ${escapeHtml(parsed.data.email)}</p>`
  });
  return { ok: true, message: `Takk. Vi har sendt inn forespørselen med anbefalingen «${recommendation.title}».` };
}

function getRecommendation(need: string, employees: string) {
  if (need === "Nettsider") return { title: employees === "1–5" ? "Nettsider – Start" : "Nettsider – Pro" };
  if (need === "WiFi") return { title: "WiFi – kartlegging og prosjektering" };
  if (need === "Fiber og telecom") return { title: "Fiber og telecom – behovskartlegging" };
  if (need === "IT support") return { title: "IT support – drift og brukerstøtte" };
  return { title: "IT og telecom – avklaringsmøte" };
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char); }
