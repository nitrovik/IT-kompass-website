"use client";

import { useEffect, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

/*
  Spamvern fra Cloudflare. Vises bare når nøkkelen er satt i miljøvariablene.
  Cloudflare-skriptet lastes først når skjemaet nærmer seg skjermen, ikke når siden åpnes
  (det er tungt og trengs ikke før noen skal sende). Plassen er reservert, så ingenting hopper.
*/
export function TurnstileField() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!siteKey || !el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShow(true);
        observer.disconnect();
      }
    }, { rootMargin: "800px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [siteKey]);

  if (!siteKey) return null;
  return (
    <div ref={ref} className="min-h-[65px]">
      {show ? <Turnstile siteKey={siteKey} options={{ theme: "light", size: "flexible", language: "nb" }} /> : null}
    </div>
  );
}
