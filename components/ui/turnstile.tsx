"use client";

import { Turnstile } from "@marsidev/react-turnstile";

/* Spamvern fra Cloudflare. Vises bare når nøkkelen er satt i miljøvariablene. */
export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return <Turnstile siteKey={siteKey} options={{ theme: "light", size: "flexible", language: "nb" }} />;
}
