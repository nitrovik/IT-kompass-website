import { homePositioning } from "@/content/home";
import { pulseKeyframes, type Segment } from "@/components/home/fiber/geometry";

/*
  Geometri og bevegelse for diagrammet i «Behovet avgjør» (positioning-section.tsx).
  Keyframes leveres i /motion.css (components/home/motion-css.ts), ikke som CSS i HTML-en.
*/
export const W = 560;
export const H = 420;
export const NEED = { x: 50, y: 210 };
export const HUB = { x: 214, y: 210 };
export const OPTION_X = 394;
export const optionY = (i: number, n: number) => 66 + (i * (H - 132)) / (n - 1);

export function routeTo(y: number) {
  return `M${HUB.x + 30} ${HUB.y} C ${HUB.x + 90} ${HUB.y}, ${OPTION_X - 90} ${y}, ${OPTION_X - 10} ${y}`;
}
const routeSegment = (y: number): Segment => [[HUB.x + 30, HUB.y], [HUB.x + 90, HUB.y], [OPTION_X - 90, y], [OPTION_X - 10, y]];
const needSegment: Segment = [[NEED.x + 10, NEED.y], [NEED.x + 60, NEED.y], [HUB.x - 80, HUB.y], [HUB.x - 30, HUB.y]];
const BOX = [W, H] as const;

/* Behov → kompass, så hvert alternativ etter tur (7 s), og til slutt den riktige ruten igjen og igjen */
function routeKeyframes(n: number, chosen: number) {
  const scan = Array.from({ length: n }, (_, i) => pulseKeyframes(`route-scan-${i}`, [{ segments: [routeSegment(optionY(i, n))], from: 0, to: 0.12 }], { unit: "%", box: BOX, steps: 16, fade: 0.2 }));
  return [
    pulseKeyframes("route-in", [{ segments: [needSegment], from: 0, to: 0.1 }], { unit: "%", box: BOX, steps: 8, fade: 0.2 }),
    ...scan,
    pulseKeyframes("route-chosen", [{ segments: [routeSegment(optionY(chosen, n))], from: 0, to: 0.7 }], { unit: "%", box: BOX, steps: 20, fade: 0.18 }),
  ].join("");
}

export const ROUTE_MOTION_CSS = routeKeyframes(homePositioning.diagram.options.length, homePositioning.diagram.chosen);
