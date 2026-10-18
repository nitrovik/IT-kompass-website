"use client";

import Script from "next/script";
import { syncChatLauncher } from "@/components/layout/compass-to-top";

/* Laster chat-assistenten etter at siden er interaktiv. onLoad synker botens egen
   launcher-knapp med kompasset med en gang scriptet er klart, selv om brukeren
   allerede har scrollet forbi terskelen før scriptet rakk å laste. */
export function ChatWidget() {
  return <Script src="/itkompass-chat.js" strategy="afterInteractive" onLoad={syncChatLauncher} />;
}
