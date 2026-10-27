import { flashKeyframes, pulseKeyframes } from "@/components/home/fiber/geometry";
import { BRANCH_ANGLES, DESKTOP, MOBILE, chosenOf, type Scene } from "@/components/home/fiber/scene";

/*
  Tidslinjen for fiberscenen i heroen, som CSS-keyframes. Regnes ut når siden bygges og
  leveres som en egen fil (/motion.css, se components/home/motion-css.ts) som lastes etter at
  siden er ferdig – ikke som CSS i HTML-en, der den ble lest to ganger og forsinket oppstarten.

  Én syklus: en impuls kommer inn → ringen markerer at den er fremme → svake impulser sjekker
  alternativene etter tur (nodene blinker) → den riktige retningen lyser opp og impulsen
  fortsetter ut.
*/

/* Andeler av syklusen */
const T = { inEnd: 0.33, scanStart: 0.36, scanLen: 0.1, chosenStart: 0.6, chosenNode: 0.7, chosenEnd: 0.86 };

/*
  Støttefibrene: en impuls hver 2. eller 3. syklus (every), som starter litt etter hovedimpulsen
  (start, sekunder) og bruker travel sekunder. Da varierer rytmen fra syklus til syklus (noen ganger
  én, to eller ingen ekstra impulser), men alt som beveger seg samtidig ligger nær hverandre. Det
  holder området skjermen må tegne på nytt lite: impulser langt fra hverandre på samme tid kostet
  nesten tre ganger så mye.
*/
const SUPPORT = { d: [{ every: 2, start: 0.5, travel: 3.6 }, { every: 3, start: 1.2, travel: 2.6 }], m: [{ every: 2, start: 0.8, travel: 3 }] };

export type Prefix = "d" | "m";
export type Pulse = { name: string; cycle: number; scan?: boolean };

function story(scene: Scene, p: Prefix) {
  const main = scene.incoming.find((f) => f.main)!;
  const chosen = chosenOf(scene);
  const scanAt = (i: number) => T.scanStart + i * scene.scanStep;
  const css: string[] = [
    pulseKeyframes(`fp-${p}-in`, [{ segments: main.segments, from: 0, to: T.inEnd }]),
    pulseKeyframes(`fp-${p}-c`, [{ segments: chosen.segments, from: T.chosenStart, to: T.chosenNode }, { segments: scene.onward, from: T.chosenNode, to: T.chosenEnd }]),
    flashKeyframes(`fr-${p}`, T.inEnd + 0.005, { fall: 0.14, max: 0.65, scale: [0.98, 1.6] }),
    flashKeyframes(`fn-${p}-c`, T.chosenNode, { fall: 0.16 }),
    `@keyframes fo-${p}{0%,${T.chosenStart * 100}%{opacity:0}${T.chosenNode * 100}%,${(T.chosenNode + 0.08) * 100}%{opacity:.9}95%,100%{opacity:0}}`,
  ];
  const pulses: Pulse[] = [{ name: `fp-${p}-in`, cycle: scene.cycle }, { name: `fp-${p}-c`, cycle: scene.cycle }];
  scene.branches.forEach((b, i) => {
    css.push(pulseKeyframes(`fp-${p}-s${i}`, [{ segments: b.segments, from: scanAt(i), to: scanAt(i) + T.scanLen }], { fade: 0.25, steps: 20 }));
    css.push(flashKeyframes(`fn-${p}-${i}`, scanAt(i) + T.scanLen, { max: 0.8, fall: 0.08 }));
    pulses.push({ name: `fp-${p}-s${i}`, cycle: scene.cycle, scan: true });
  });
  scene.incoming.filter((f) => !f.main).forEach((f, i) => {
    const { every, start, travel } = SUPPORT[p][i];
    const cycle = scene.cycle * every;
    css.push(pulseKeyframes(`fp-${p}-x${i}`, [{ segments: f.segments, from: start / cycle, to: (start + travel) / cycle }]));
    pulses.push({ name: `fp-${p}-x${i}`, cycle });
  });
  return { css, pulses };
}

const STORY = { d: story(DESKTOP, "d"), m: story(MOBILE, "m") };

/* Elementene fiber-scene.tsx skal tegne for hver impuls */
export const HERO_PULSES: Record<Prefix, Pulse[]> = { d: STORY.d.pulses, m: STORY.m.pulses };

export const HERO_MOTION_CSS = [
  ...STORY.d.css,
  ...STORY.m.css,
  // PC: grenen pekeren peker mot lyser opp (data-focus settes av hero-pointer.tsx)
  ...BRANCH_ANGLES.map((_, i) => `.fiber-anchor[data-focus="${i}"] .fiber-focus[data-branch="${i}"]{opacity:1}`),
].join("");
