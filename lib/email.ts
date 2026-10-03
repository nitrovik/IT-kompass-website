import { Resend } from "resend";

export async function sendContactEmail({ subject, html, replyTo, attachments }: { subject: string; html: string; replyTo?: string; attachments?: { filename: string; content: Buffer }[] }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.CONTACT_RECIPIENT;

  if (!apiKey || !from || !to) {
    if (process.env.NODE_ENV !== "production") return { mode: "development" as const };
    throw new Error("Emaillevering er ikke konfigurert.");
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({ from, to: [to], subject, html, ...(replyTo ? { replyTo } : {}), ...(attachments?.length ? { attachments } : {}) });
  if (result.error) throw new Error(result.error.message);
  return { mode: "sent" as const };
}
