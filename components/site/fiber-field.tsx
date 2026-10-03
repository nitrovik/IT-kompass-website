import { cn } from "@/lib/utils";

/*
  Fiberkabler med lysimpulser. Ren SVG + CSS-animasjon, så den er lett, fungerer
  uten JavaScript og stopper av seg selv ved «redusert bevegelse».
*/
const heroPaths = [
  { d: "M430 580 C650 430 710 250 1030 150 C1180 100 1290 110 1410 70", pulse: "fiber-core" },
  { d: "M370 610 C620 470 760 310 1080 180 C1190 135 1310 140 1420 105", pulse: "fiber-shadow" },
  { d: "M460 610 C660 470 820 355 1090 235 C1220 175 1320 190 1410 165", pulse: "fiber-light" },
  { d: "M590 650 C760 510 820 380 1100 285 C1230 240 1340 250 1420 240", pulse: "fiber-core" },
];

const heroGlows = [
  { cx: 964, cy: 177, r: 7, delay: "0s" },
  { cx: 1130, cy: 130, r: 5, delay: "1.1s" },
  { cx: 816, cy: 322, r: 5, delay: "2.2s" },
];

const bannerPaths = [
  { d: "M-30 150 C220 30 430 35 650 120 S1000 145 1230 50", pulse: "fiber-core" },
  { d: "M-40 165 C190 65 410 20 680 105 S1020 150 1240 80", pulse: "fiber-light" },
];

export function FiberField({ variant = "hero", className }: { variant?: "hero" | "banner"; className?: string }) {
  const paths = variant === "hero" ? heroPaths : bannerPaths;
  const viewBox = variant === "hero" ? "0 0 1400 650" : "0 0 1200 180";
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {paths.map((path) => <path key={`cable-${path.d}`} className="fiber fiber-cable" d={path.d} />)}
      {paths.map((path) => <path key={`pulse-${path.d}`} className={cn("fiber", path.pulse)} d={path.d} />)}
      {variant === "hero" ? heroGlows.map((glow) => <circle key={`${glow.cx}-${glow.cy}`} className="fiber-glow" cx={glow.cx} cy={glow.cy} r={glow.r} style={{ animationDelay: glow.delay }} />) : null}
    </svg>
  );
}
