"use client";

import Script from "next/script";

/* Laster chat-assistenten når siden er ferdig og nettleseren har ledig tid, så den ikke
   konkurrerer med første visning. Botens egen runde knapp står nederst til høyre. */
export function ChatWidget() {
  return <Script src="/itkompass-chat.js" strategy="lazyOnload" />;
}
