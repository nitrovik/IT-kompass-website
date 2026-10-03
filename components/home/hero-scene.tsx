"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroSceneCanvas = dynamic(() => import("@/components/home/hero-scene-canvas").then((m) => m.HeroSceneCanvas), { ssr: false });

export function HeroScene() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const cores = navigator.hardwareConcurrency || 8;
    const memory = "deviceMemory" in navigator ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) : 8;
    setEnabled(!reduce && desktop && cores >= 4 && memory >= 4);
  }, []);

  if (!enabled) return null;
  return (
    <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
      <div className="absolute inset-0 opacity-60"><HeroSceneCanvas /></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,17,31,.08)_40%,rgba(7,17,31,.92)_90%)]" />
    </div>
  );
}
