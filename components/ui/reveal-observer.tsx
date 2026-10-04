"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal],[data-split],[data-observe]";

/*
  Én felles IntersectionObserver for hele nettstedet i stedet for én komponent per
  element. Elementer merket med data-reveal / data-split / data-observe får
  data-inview="true" når de kommer til syne. data-observe="toggle" settes tilbake til
  "false" når elementet forlater skjermen (brukes for å pause animasjoner).
*/
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const toggle = el.dataset.observe === "toggle";
          if (entry.isIntersecting) {
            el.dataset.inview = "true";
            if (!toggle) observer.unobserve(el);
          } else if (toggle) {
            el.dataset.inview = "false";
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    let frame = 0;
    const scan = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.querySelectorAll(SELECTOR).forEach((el) => {
          if (seen.has(el)) return;
          seen.add(el);
          observer.observe(el);
        });
      });
    };
    scan();
    root.setAttribute("data-reveal-ready", "");

    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
