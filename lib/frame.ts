/*
  Én felles bildeløkke (requestAnimationFrame) for alt som beveger seg med scroll eller
  peker: myk scrolling (Lenis), scroll-koblede effekter, kortlys og fiberscenen.

  Rekkefølgen i hvert bilde er fast:
  1. Lenis flytter scrollposisjonen.
  2. Lesing: scrollposisjonen leses én gang. Plasseringen til elementene måles bare når
     sidens størrelse har endret seg, aldri per bilde.
  3. Skriving: scroll-effektene skriver transform / CSS-variabler.
  4. Animasjoner (kortlys, magnetknapper, fiberscenen) oppdateres.

  Slik leses layout aldri etter at noe er skrevet i samme bilde (ingen tvungen omberegning),
  og alt som følger scrollen står i samme bilde som innholdet. Løkken stopper helt når
  ingenting beveger seg.
*/

export type ScrollState = {
  /** Scrollposisjon i px */
  y: number;
  /** Vinduets høyde og bredde */
  vh: number;
  vw: number;
  /** Største mulige scrollposisjon */
  max: number;
  /** true mens siden scroller (og et lite øyeblikk etter) */
  scrolling: boolean;
};

export type ScrollTask = {
  /** Kalles når sidens størrelse har endret seg: mål og lagre plassering her. */
  measure?: (state: ScrollState) => void;
  /** Kalles når scrollposisjonen har endret seg: bare skriving, ingen layoutlesing. */
  update: (state: ScrollState) => void;
};

/** Returner true for å bli kalt igjen neste bilde. */
export type FrameTask = (now: number) => boolean;

const state: ScrollState = { y: 0, vh: 0, vw: 0, max: 0, scrolling: false };
const scrollTasks = new Set<ScrollTask>();
const frameTasks = new Set<FrameTask>();
let driver: ((now: number) => boolean) | null = null;
let frame = 0;
let lastY = Number.NaN;
let lastMoveAt = 0;
let scrollPending = true;
let geometryDirty = true;
let listening = false;

function run(now: number) {
  frame = 0;
  const driving = driver ? driver(now) : false;

  // Lesing – før noe skrives i dette bildet
  if (driving || scrollPending || geometryDirty) {
    scrollPending = false;
    const y = window.scrollY;
    if (geometryDirty) {
      state.vh = window.innerHeight;
      state.vw = window.innerWidth;
      state.max = Math.max(document.documentElement.scrollHeight - state.vh, 0);
    }
    const moved = y !== lastY;
    if (moved && !Number.isNaN(lastY)) lastMoveAt = now;
    if (moved || geometryDirty) {
      state.y = y;
      lastY = y;
      if (geometryDirty) {
        geometryDirty = false;
        scrollTasks.forEach((task) => task.measure?.(state));
      }
      // Skriving
      scrollTasks.forEach((task) => task.update(state));
    }
  }
  state.scrolling = driving || now - lastMoveAt < 160;

  // Animasjoner
  frameTasks.forEach((task) => { if (!task(now)) frameTasks.delete(task); });

  // (en oppgave kan allerede ha bedt om neste bilde – aldri to på rad)
  if (!frame && (driving || state.scrolling || frameTasks.size)) frame = requestAnimationFrame(run);
}

export function requestFrame() {
  if (!frame && typeof window !== "undefined") frame = requestAnimationFrame(run);
}

const onScrollEvent = () => { scrollPending = true; requestFrame(); };
const onResize = () => { geometryDirty = true; requestFrame(); };

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScrollEvent, { passive: true });
  window.addEventListener("resize", onResize);
  // Sidehøyden endres når skrift og bilder lastes eller innhold åpnes/lukkes
  new ResizeObserver(onResize).observe(document.body);
}

/** Scroll-koblet effekt. Returnerer en funksjon som avslutter abonnementet. */
export function onScroll(task: ScrollTask) {
  listen();
  scrollTasks.add(task);
  geometryDirty = true;
  requestFrame();
  return () => { scrollTasks.delete(task); };
}

/** Animasjon som kjører hvert bilde så lenge den returnerer true. */
export function onFrame(task: FrameTask) {
  frameTasks.add(task);
  requestFrame();
  return () => { frameTasks.delete(task); };
}

/** Lenis (myk scrolling) kjøres først i hvert bilde. Returnerer true mens den animerer. */
export function setScrollDriver(next: ((now: number) => boolean) | null) {
  listen();
  driver = next;
  requestFrame();
}

/** Siste kjente scrolltilstand – kan leses fra hendelser uten å tvinge layout. */
export function scrollState(): Readonly<ScrollState> {
  return state;
}
