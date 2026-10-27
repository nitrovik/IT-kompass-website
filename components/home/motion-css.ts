import { HERO_SIGNAL_CSS } from "@/components/home/hero-signals";

/*
  Keyframes for lyssignalene i heroen, som en egen statisk fil (/motion.css, app/motion.css/route.ts).
  Filen lastes av hero-motion.tsx etter at siden er ferdig, og bare når bevegelse er ønsket
  (ikke ved «redusert bevegelse» eller datasparing). Uten den står signalene stille (skjult).
  Da slipper HTML-en og den blokkerende CSS-en å bære banene (ca. 10 kB).
  ?v= er et fingeravtrykk av innholdet, så filen kan mellomlagres lenge og likevel byttes ut.
*/
export const MOTION_CSS = HERO_SIGNAL_CSS;

function fingerprint(text: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193);
  return (hash >>> 0).toString(36);
}

export const MOTION_CSS_URL = `/motion.css?v=${fingerprint(MOTION_CSS)}`;
