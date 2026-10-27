import type { ReactNode } from "react";
import { pathData, pulseKeyframes, type Point, type Segment } from "@/components/home/fiber/geometry";

/*
  Fiberscenen i heroen. Få, gjennomtegnede fibre som samles i kompasset og fortsetter
  videre mot høyre: behov og teknologi inn, riktig retning ut.

  Alt er tegnet rundt ett punkt, kompassets sentrum (0, 0). Ankeret (.fiber-anchor) står
  der kompasset skal stå, og SVG-en, lysimpulsene og kompasset er plassert ut fra det.
  Linjene treffer derfor alltid kompasset, og proporsjonene er like på alle skjermer.

  - Fibrene er en statisk SVG som tegnes én gang. Ingen filter, ingen blur.
  - Lysimpulsene er små elementer som flyttes med transform-keyframes langs banene
    (se geometry.ts). Skjermkortet gjør jobben alene: ingen JavaScript, ingen ny maling.
  - Impulsene starter først når siden er ferdig lastet (data-fiber-live, se hero-pointer.tsx),
    står stille når heroen ikke er synlig, og vises ikke ved «redusert bevegelse».
  - Mobil har færre fibre og en egen, enklere komposisjon (fibre inn fra venstre).
*/

type Fiber = { id: string; segments: Segment[]; width: number; color: string; opacity: number; halo?: boolean; fade: "in" | "out" };

/* Retningen fibrene har når de går inn i kompasset (svakt stigende mot høyre) */
const IN: Point = [0.941, -0.339];
const NORMAL: Point = [0.339, 0.941];

/* Siste del før kompasset: fibrene ligger tett og parallelt, som en samlet kabel */
function intoHub(from: Segment, offset: number): Segment[] {
  const [, , c2, end] = from;
  const handle: Point = [end[0] + (end[0] - c2[0]) * 0.6, end[1] + (end[1] - c2[1]) * 0.6];
  const approach: Point = [-IN[0] * 150 + NORMAL[0] * offset, -IN[1] * 150 + NORMAL[1] * offset];
  const hub: Point = [NORMAL[0] * offset * 0.3, NORMAL[1] * offset * 0.3];
  return [from, [end, handle, approach, hub]];
}

const DESKTOP: Fiber[] = [
  // Hovedfiberen: inn fra nede til venstre, under teksten, opp til kompasset
  { id: "d-main", segments: intoHub([[-1250, 560], [-900, 560], [-560, 470], [-330, 300]], 0), width: 1.6, color: "#1d6fc4", opacity: 0.9, halo: true, fade: "in" },
  // Støttefibre som samles i samme bunt
  { id: "d-low", segments: intoHub([[-1000, 720], [-760, 700], [-470, 520], [-290, 330]], 7), width: 1, color: "#4b8fd6", opacity: 0.6, fade: "in" },
  { id: "d-steep", segments: intoHub([[-640, 760], [-520, 640], [-350, 420], [-240, 290]], 14), width: 0.9, color: "#2a8aa8", opacity: 0.55, fade: "in" },
  { id: "d-far", segments: intoHub([[-1750, 430], [-1200, 425], [-700, 400], [-420, 300]], -7), width: 1, color: "#6ea6dd", opacity: 0.55, fade: "in" },
  // Ut av kompasset: retningen videre (nålen peker samme vei)
  { id: "d-out", segments: [[[0, 0], [113, -41], [260, -110], [430, -170]], [[430, -170], [600, -230], [760, -262], [980, -280]]], width: 1.4, color: "#1d6fc4", opacity: 0.75, halo: true, fade: "out" },
  { id: "d-out-2", segments: [[[0.3, 0.9], [140, -30], [400, -60], [900, -40]]], width: 0.9, color: "#4b8fd6", opacity: 0.45, fade: "out" },
];

const MOBILE: Fiber[] = [
  { id: "m-main", segments: [[[-440, 62], [-260, 62], [-130, 22], [0, 0]]], width: 1.4, color: "#1d6fc4", opacity: 0.9, halo: true, fade: "in" },
  { id: "m-high", segments: [[[-440, -40], [-280, -40], [-140, -8], [0, 0]]], width: 0.9, color: "#4b8fd6", opacity: 0.6, fade: "in" },
  { id: "m-low", segments: [[[-440, 112], [-300, 104], [-150, 34], [0, 0]]], width: 0.8, color: "#2a8aa8", opacity: 0.5, fade: "in" },
  { id: "m-out", segments: [[[0, 0], [90, -16], [170, -60], [260, -140]]], width: 1.2, color: "#1d6fc4", opacity: 0.7, fade: "out" },
];

const fiber = (set: Fiber[], id: string) => set.find((f) => f.id === id)!.segments;

/* Lysimpulsene: én går gjennom kompasset og videre ut, de andre stopper i det */
const KEYFRAMES = [
  pulseKeyframes("fp-d-main", [{ segments: fiber(DESKTOP, "d-main"), from: 0, to: 0.42 }, { segments: fiber(DESKTOP, "d-out"), from: 0.46, to: 0.7 }]),
  pulseKeyframes("fp-d-steep", [{ segments: fiber(DESKTOP, "d-steep"), from: 0, to: 0.36 }]),
  pulseKeyframes("fp-d-far", [{ segments: fiber(DESKTOP, "d-far"), from: 0, to: 0.46 }]),
  pulseKeyframes("fp-m-main", [{ segments: fiber(MOBILE, "m-main"), from: 0, to: 0.4 }, { segments: fiber(MOBILE, "m-out"), from: 0.45, to: 0.66 }]),
  pulseKeyframes("fp-m-high", [{ segments: fiber(MOBILE, "m-high"), from: 0, to: 0.4 }]),
].join("");

const VIEW = { x: -2400, y: -1100, w: 3600, h: 2200 };

function Fibers({ set, className }: { set: Fiber[]; className: string }) {
  return (
    <svg className={`fiber-svg ${className}`} style={{ left: VIEW.x, top: VIEW.y }} width={VIEW.w} height={VIEW.h} viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} aria-hidden="true" focusable="false">
      <defs>
        {set.map(({ id, segments, color, opacity, fade }) => {
          const start = segments[0][0];
          const end = segments[segments.length - 1][3];
          // Inn: svak ute ved kanten, sterkest ved kompasset. Ut: motsatt.
          const [x1, y1, x2, y2] = fade === "in" ? [start[0] * 0.7, start[1] * 0.7, -60, 0] : [40, 0, end[0], end[1]];
          return (
            <linearGradient key={id} id={`fg-${id}`} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
              <stop offset="0" stopColor={color} stopOpacity={fade === "in" ? 0 : opacity} />
              <stop offset={fade === "in" ? 0.55 : 0.45} stopColor={color} stopOpacity={opacity * 0.75} />
              <stop offset="1" stopColor={color} stopOpacity={fade === "in" ? opacity : 0} />
            </linearGradient>
          );
        })}
      </defs>
      <g fill="none" strokeLinecap="round">
        {/* Myk dybde rundt de viktigste fibrene: en bred, svak strek (ikke blur) */}
        {set.filter((f) => f.halo).map((f) => <path key={`h-${f.id}`} d={pathData(f.segments)} stroke={`url(#fg-${f.id})`} strokeWidth={f.width * 4.5} strokeOpacity={0.09} />)}
        {set.map((f) => <path key={f.id} d={pathData(f.segments)} stroke={`url(#fg-${f.id})`} strokeWidth={f.width} />)}
        {/* Diskré refleks i glasset langs hovedfibrene */}
        {set.filter((f) => f.halo).map((f) => <path key={`r-${f.id}`} d={pathData(f.segments)} transform="translate(0 -0.6)" stroke="#fff" strokeOpacity={0.55} strokeWidth={0.5} />)}
      </g>
    </svg>
  );
}

export function FiberScene({ children }: { children: ReactNode }) {
  return (
    <div className="fiber-anchor" aria-hidden="true">
      <style>{KEYFRAMES}</style>
      {/* Lyset i bakgrunnen står bak kompasset (statisk, tegnes én gang) */}
      <span className="fiber-glow" />
      <Fibers set={DESKTOP} className="hidden lg:block" />
      <Fibers set={MOBILE} className="lg:hidden" />
      <span className="fiber-pulse hidden lg:block" style={{ animationName: "fp-d-main" }}><span /></span>
      <span className="fiber-pulse hidden lg:block" style={{ animationName: "fp-d-steep", animationDelay: "4s" }}><span /></span>
      <span className="fiber-pulse hidden lg:block" style={{ animationName: "fp-d-far", animationDelay: "8s" }}><span /></span>
      <span className="fiber-pulse lg:hidden" style={{ animationName: "fp-m-main" }}><span /></span>
      <span className="fiber-pulse lg:hidden" style={{ animationName: "fp-m-high", animationDelay: "5s" }}><span /></span>
      <span className="fiber-ring" />
      {children}
    </div>
  );
}
