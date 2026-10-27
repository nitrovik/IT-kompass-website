"use client";

import { useEffect, useRef } from "react";
import { homeIntro } from "@/content/home";

/*
  Behovsillustrasjonen, gjenopprettet fra den tidligere seksjonen «Behovet avgjør» (samme geometri,
  tekster og farger): behovet til venstre, kompasset i midten, fire alternativer til høyre.

  Ett alternativ er valgt om gangen, og valget skifter tilfeldig:
  - Alternativene trekkes som fra en stokket kortstokk: alle fire kommer i hver runde, i tilfeldig
    rekkefølge, og samme alternativ kommer aldri to ganger på rad.
  - Ved hvert skifte går en lyspuls fra behovet inn i kompasset og ut langs banen til det nye
    alternativet. Nålen snur seg mot banen, banen lyser opp, og når pulsen er fram lyser markøren,
    teksten blir tydelig og «Riktig valg» flytter dit. Rekkefølgen styres av forsinkelser i CSS,
    så JavaScript gjør bare én ting per skifte: bytter klassen is-active og starter pulsen.
  - Pulsen og nålen flyttes med transform (skjermkortet). Ingen React-oppdateringer etter første visning.
  - Står stille utenfor skjermen og i skjult fane. Ved redusert bevegelse vises alternativ C fast.
*/
const W = 560;
const H = 420;
const NEED = { x: 50, y: 210 };
const HUB = { x: 214, y: 210 };
const OPTION_X = 394;
const optionY = (i: number, n: number) => 66 + (i * (H - 132)) / (n - 1);
const routeTo = (y: number) => `M${HUB.x + 30} ${HUB.y} C ${HUB.x + 90} ${HUB.y}, ${OPTION_X - 90} ${y}, ${OPTION_X - 10} ${y}`;
const needleAngle = (y: number) => 90 + (Math.atan2(y - HUB.y, OPTION_X - HUB.x) * 180) / Math.PI;
const pct = (x: number, total: number) => `${((x / total) * 100).toFixed(3)}%`;
const HOLD = 4600;

function cubic(t: number, a: number, b: number, c: number, d: number) {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
}

/* Pulsens vei: rett inn fra behovet til kompasset, så langs kurven til alternativet (prosent av figuren) */
function pulseFrames(y: number): Keyframe[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= 8; i++) points.push({ x: NEED.x + 10 + ((HUB.x - 30 - NEED.x - 10) * i) / 8, y: NEED.y });
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    points.push({ x: cubic(t, HUB.x + 30, HUB.x + 90, OPTION_X - 90, OPTION_X - 10), y: cubic(t, HUB.y, HUB.y, y, y) });
  }
  // Like mye tid per strekning som lengden tilsier, så farten er jevn
  const lengths = points.map((p, i) => (i ? Math.hypot(p.x - points[i - 1].x, p.y - points[i - 1].y) : 0));
  const total = lengths.reduce((a, b) => a + b, 0);
  let run = 0;
  return points.map((p, i) => {
    run += lengths[i];
    const offset = run / total;
    const opacity = offset < 0.06 ? offset / 0.06 : offset > 0.92 ? (1 - offset) / 0.08 : 1;
    return { offset, transform: `translate3d(${pct(p.x, W)}, ${pct(p.y, H)}, 0)`, opacity: opacity.toFixed(3) };
  });
}

export function NeedsDiagram() {
  const { diagram } = homeIntro;
  const n = diagram.options.length;
  const figRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fig = figRef.current;
    if (!fig || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const needle = fig.querySelector<HTMLElement>(".nd-needle");
    const dot = fig.querySelector<HTMLElement>(".nd-pulse");
    const parts = [...fig.querySelectorAll<HTMLElement | SVGElement>("[data-opt]")];
    const frames = diagram.options.map((_, i) => pulseFrames(optionY(i, n)));
    let active = diagram.chosen;
    let deck: number[] = [];
    let timer = 0;
    let running = false;

    const draw = () => {
      if (!deck.length) {
        deck = diagram.options.map((_, i) => i);
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
      }
      // Aldri samme alternativ to ganger på rad, heller ikke når en ny runde starter
      let next = deck.pop()!;
      if (next === active && deck.length) {
        deck.unshift(next);
        next = deck.pop()!;
      }
      return next === active ? (active + 1 + Math.floor(Math.random() * (n - 1))) % n : next;
    };

    const select = (index: number) => {
      active = index;
      fig.dataset.active = String(index);
      parts.forEach((el) => el.classList.toggle("is-active", Number(el.dataset.opt) === index));
      if (needle) needle.style.transform = `translate(-50%, -50%) rotate(${needleAngle(optionY(index, n)).toFixed(2)}deg)`;
      dot?.animate(frames[index], { duration: 1700, easing: "linear" });
    };

    const tick = () => {
      select(draw());
      timer = window.setTimeout(tick, HOLD);
    };
    const sync = (visible: boolean) => {
      const go = visible && !document.hidden;
      if (go === running) return;
      running = go;
      window.clearTimeout(timer);
      if (go) timer = window.setTimeout(tick, 1200);
    };
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync(visible);
    });
    io.observe(fig);
    const onVisibility = () => sync(visible);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };
  }, [diagram, n]);

  const chosenY = optionY(diagram.chosen, n);
  return (
    <figure ref={figRef} className="nd" data-observe="toggle" data-active={diagram.chosen}>
      <div className="nd-stage">
        <svg viewBox={`0 0 ${W} ${H}`} className="nd-svg" role="img" aria-label={diagram.label}>
          <defs>
            <linearGradient id="nd-route-hi" x1="0" x2="1">
              <stop offset="0" stopColor="#2aa6ff" stopOpacity=".5" />
              <stop offset="1" stopColor="#7fd0ff" />
            </linearGradient>
            <radialGradient id="nd-hub-glow">
              <stop offset="0" stopColor="#2aa6ff" stopOpacity=".35" />
              <stop offset="1" stopColor="#2aa6ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={HUB.x} cy={HUB.y} r="90" fill="url(#nd-hub-glow)" />

          {/* Behov → kompass */}
          <path d={`M${NEED.x + 10} ${NEED.y} L ${HUB.x - 30} ${HUB.y}`} fill="none" stroke="#8fd0ff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />

          {/* Kompass → alternativer: dempede baner (de lyse ligger i egne lag under) */}
          {diagram.options.map((_, i) => {
            const y = optionY(i, n);
            return (
              <g key={i}>
                <path d={routeTo(y)} fill="none" stroke="#8fa8c2" strokeOpacity=".32" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx={OPTION_X} cy={y} r="6" fill="#0b2342" stroke="#8fa8c2" strokeOpacity=".6" strokeWidth="1.6" />
              </g>
            );
          })}

          {/* Behovet */}
          <circle cx={NEED.x} cy={NEED.y} r="9" fill="#0b2342" stroke="#8fd0ff" strokeWidth="1.6" />
          <circle cx={NEED.x} cy={NEED.y} r="3.5" fill="#8fd0ff" />

          {/* Kompasset fra logoen: ring og fire merker. Nålen ligger i et eget lag over. */}
          <circle cx={HUB.x} cy={HUB.y} r="30" fill="#0e2747" stroke="#fff" strokeOpacity=".9" strokeWidth="2.2" />
          {Array.from({ length: 4 }, (_, i) => {
            const a = (i * Math.PI) / 2;
            const r2 = (v: number) => Math.round(v * 100) / 100;
            return <line key={i} x1={r2(HUB.x + Math.sin(a) * 23)} y1={r2(HUB.y - Math.cos(a) * 23)} x2={r2(HUB.x + Math.sin(a) * 30)} y2={r2(HUB.y - Math.cos(a) * 30)} stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />;
          })}
        </svg>

        {/* Den lyse banen til hvert alternativ i sitt eget lag, så den tones inn med opacity på skjermkortet */}
        {diagram.options.map((_, i) => (
          <svg key={i} viewBox={`0 0 ${W} ${H}`} data-opt={i} className={i === diagram.chosen ? "nd-hi is-active" : "nd-hi"} aria-hidden="true">
            <path d={routeTo(optionY(i, n))} fill="none" stroke="url(#nd-route-hi)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ))}

        <svg className="nd-needle" viewBox="-20 -20 40 40" aria-hidden="true" style={{ left: pct(HUB.x, W), top: pct(HUB.y, H), transform: `translate(-50%, -50%) rotate(${needleAngle(chosenY).toFixed(2)}deg)` }}>
          <path d="M0 -19L5 0H-5Z" fill="#fff" />
          <path d="M-5 0H5L0 19Z" fill="#4fb3cf" />
          <circle r="2.6" fill="#0e2747" stroke="#fff" strokeWidth="1.2" />
        </svg>

        {/* Markørene ved alternativene: lysende punkt og en rolig puls for det valgte */}
        {diagram.options.map((_, i) => (
          <span key={i} data-opt={i} className={i === diagram.chosen ? "nd-marker is-active" : "nd-marker"} style={{ left: pct(OPTION_X, W), top: pct(optionY(i, n), H) }} aria-hidden="true">
            <span className="nd-ring" />
          </span>
        ))}

        {/* Lyspulsen: et lag på størrelse med figuren som flyttes med transform */}
        <span className="nd-pulse" aria-hidden="true"><span /></span>

        {/* Etiketter i HTML, så de er skarpe og lesbare på alle skjermer */}
        <span className="nd-label nd-need" style={{ left: pct(NEED.x, W), top: pct(NEED.y, H) }}>{diagram.need}</span>
        <span className="nd-label nd-hub" style={{ left: pct(HUB.x, W), top: pct(HUB.y, H) }}>{diagram.hub}</span>
        {diagram.options.map((option, i) => (
          <span key={option} data-opt={i} className={i === diagram.chosen ? "nd-option is-active" : "nd-option"} style={{ left: pct(OPTION_X, W), top: pct(optionY(i, n), H) }}>
            <span className="nd-option-name">{option}</span>
            <span className="nd-badge" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="m1.5 5.2 2.2 2.2L8.5 2.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {diagram.result}
            </span>
          </span>
        ))}
      </div>
      <figcaption className="nd-caption">{diagram.caption}</figcaption>
    </figure>
  );
}
