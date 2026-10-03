import { validateTurnstile } from "@/lib/turnstile";
import { sendContactEmail } from "@/lib/email";

export type FormState = { ok: boolean; message: string };

export function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
}

/* Lager en enkel HTML-tabell av feltene til e-posten. Alle verdier escapes. */
export function emailTable(title: string, rows: [label: string, value: string | undefined][]) {
  const body = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `<tr><th align="left" valign="top" style="padding:4px 12px 4px 0">${escapeHtml(label)}</th><td style="padding:4px 0">${escapeHtml(value ?? "").replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  return `<h1 style="font-family:sans-serif">${escapeHtml(title)}</h1><table style="font-family:sans-serif;font-size:14px">${body}</table>`;
}

/* Cloudflare Turnstile legger svaret i et skjult felt med dette navnet. */
export function turnstileToken(formData: FormData) {
  const value = formData.get("cf-turnstile-response");
  return typeof value === "string" ? value : undefined;
}

export async function checkHuman(formData: FormData): Promise<FormState | null> {
  const valid = await validateTurnstile(turnstileToken(formData));
  return valid ? null : { ok: false, message: "Vi klarte ikke å bekrefte at du er en ekte person. Last inn siden på nytt og prøv igjen." };
}

export async function deliver(email: Parameters<typeof sendContactEmail>[0], success: string): Promise<FormState> {
  try {
    await sendContactEmail(email);
    return { ok: true, message: success };
  } catch (error) {
    console.error("[skjema] E-post kunne ikke sendes:", error);
    return { ok: false, message: "Vi fikk ikke sendt meldingen akkurat nå. Prøv igjen litt senere." };
  }
}
