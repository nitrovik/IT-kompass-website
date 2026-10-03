"use client";

import { Turnstile } from "@marsidev/react-turnstile";

export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return <Turnstile siteKey={siteKey} options={{ theme: "dark", size: "flexible" }} />;
}
