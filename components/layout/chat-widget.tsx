"use client";

import Script from "next/script";

/* Laster chat-assistenten etter at siden er interaktiv. Ingen koordinering med annen
   UI – botens egen runde knapp står permanent nederst til høyre. */
export function ChatWidget() {
  return <Script src="/itkompass-chat.js" strategy="afterInteractive" />;
}
