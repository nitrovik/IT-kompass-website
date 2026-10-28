"use client";

import { useState } from "react";

/* Pauseknapp for logostripen (WCAG 2.2.2: bevegelse som varer, skal kunne stoppes). */
export function MarqueePause() {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      className="partners-pause"
      aria-pressed={paused}
      aria-label={paused ? "Start logostripen" : "Stopp logostripen"}
      onClick={(event) => {
        const next = !paused;
        setPaused(next);
        event.currentTarget.closest(".partners")?.toggleAttribute("data-paused", next);
      }}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M5 3.5v9l7.5-4.5z" /> : <path d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" />}
      </svg>
    </button>
  );
}
