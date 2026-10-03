"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const HeroSceneCanvas = dynamic(() => import("@/components/home/hero-scene-canvas").then((m) => m.HeroSceneCanvas), { ssr: false });

const QUERIES = ["(prefers-reduced-motion: reduce)", "(min-width: 1024px) and (pointer: fine)"];

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((query) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () => lists.forEach((list) => list.removeEventListener("change", onChange));
}

function canRenderScene() {
  const reduce = window.matchMedia(QUERIES[0]).matches;
  const desktop = window.matchMedia(QUERIES[1]).matches;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = "deviceMemory" in navigator ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) : 8;
  return !reduce && desktop && cores >= 4 && memory >= 4;
}

export function HeroScene() {
  const enabled = useSyncExternalStore(subscribe, canRenderScene, () => false);

  if (!enabled) return null;
  return (
    <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
      <div className="absolute inset-0 opacity-60"><HeroSceneCanvas /></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,17,31,.08)_40%,rgba(7,17,31,.92)_90%)]" />
    </div>
  );
}
