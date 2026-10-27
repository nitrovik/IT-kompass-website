**Text and copywriting:** Before writing or changing any text on the website, read and follow `SKRIVEREGLER.md`. It overrides any other writing guidance in this file.# IT Kompass AS – Claude Code project instructions

You are working on the website for IT Kompass AS, a Norwegian IT and telecom company.

## The user's level
The site owner is not a developer. Explain important changes in simple Norwegian when asked, avoid unnecessary jargon, and never assume technical knowledge.

## Source of truth for the current design
The current approved visual direction is documented in:
- `HANDOFF.md`
- `design/reference-homepage-preview.html`
- `design/design-reference-user.png` (owner's original inspiration; its partner logos and other invented details must NOT be copied. Viken is now the confirmed area, see Content rules)
- `public/brand/it-kompass-logo.png`
- `public/brand/it-kompass-logo-web.png`

Do not redesign the visual direction from scratch. Improve implementation quality while preserving the approved direction unless the owner explicitly asks for a redesign.

## Brand direction
The approved balance is:
- predominantly light UI: white, off-white and very light blue/grey surfaces
- dark navy used for typography, footer, key panels and selected contrast sections
- electric blue as an accent
- the logo's compass + fiber/light identity is the visual signature
- the page should feel premium, modern and exclusive, but still approachable and credible for small and medium-sized businesses
- avoid an overly dark, cyberpunk or sci-fi look

## Logo
Use the supplied logo assets. The production logo is:
`public/brand/it-kompass-logo.png`

The logo should be treated as a primary brand asset, not recreated with CSS or replaced with an icon.
The web-cropped version is:
`public/brand/it-kompass-logo-web.png`

Use the real logo in header and footer. Keep proportions correct.

## Required signature interactions
These are important parts of the experience, not optional decoration:

1. Hero fiber scene
- a few hand-drawn fiber paths (6 on desktop, 4 on mobile) that gather into the compass and continue calmly to the right: needs/technology in, the right direction out (see Technical stack → Hero fiber scene)
- small, slow light impulses travel along the paths. The owner asked for them again in October 2026 (master prompt), on the condition that they cost next to nothing: transform/opacity keyframes only, never stroke-dashoffset, SVG filters, SMIL or a JS loop
- the compass is the visual anchor on desktop and mobile; its needle rests along the outgoing fiber and softly follows the pointer on capable desktop devices
- never fill the hero with many parallel lines, loose particles or fibers crossing the heading or CTA
- do not make it look like neon or a game

2. Service-card pointer spotlight
- in the main “Hva vi driver med / Våre tjenester” cards, a soft radial spotlight follows the mouse pointer
- subtle tilt on capable desktop devices
- slight luminous border / depth response
- no layout shifts
- no heavy blur animation

3. Motion style
- premium, calm, smooth
- prefer transform and opacity
- keep animation durations coherent
- use reduced-motion fallbacks
- avoid excessive continuous animations; the few that exist (hero impulses, diagram impulses, footer impulse, partner banner) animate transform/opacity only and pause off-screen

4. Compass signature
- the compass should appear as a subtle recurring motif
- scroll-linked compass behavior is welcome, but it must remain restrained

## Homepage visual hierarchy
The homepage should communicate in seconds:
1. IT Kompass works with IT and telecom
2. the company is supplier-independent
3. there are four clear service areas
4. customers can contact the company or use “Finn riktig løsning”

Approved homepage structure:
- header/navigation
- hero with fiber background and CTAs
- supplier/partner logo banner (`components/home/partner-banner.tsx`), rendered only when `content/partners.ts` has confirmed partners; preview at `/forhandsvisning/partnere` (noindex, not in the sitemap)
- services
- supplier-independent explanation / why IT Kompass
- process / how we work
- website showcase (links to the packages and prices on `/tjenester/nettsider#pakker`; owner moved them there in October 2026)
- “Finn riktig løsning” CTA
- contact area with form and coverage-map placeholder
- footer

## Content rules
Never invent:
- phone number
- email address
- street address
- geographic coverage area
- customer names
- testimonials
- customer results
- partner relationships
- partner logos
- project statistics
- pricing

Coverage area (confirmed by the owner, October 2026): physical work in Viken, digital work in all of Norway (`config/site.ts`). Do not invent other areas or cities.
No lorem ipsum.
All content should be Norwegian Bokmål and concise.

## Content architecture
Website content belongs in `content/` data files whenever practical. Partner logos: `content/partners.ts` + files in `public/partners/` (only confirmed partners; width/height required so proportions stay correct).
Keep components reusable so future migration to a headless CMS such as Sanity is possible without rewriting the UI.

## Performance
Target Lighthouse >95.
- lazy-load heavy visual effects
- do not load 3D on mobile unless there is a clear reason
- provide a non-3D fallback
- avoid unnecessary client components
- use CSS variables and transforms for pointer effects
- avoid measuring/reflowing layout on every pointer frame

## Accessibility
Target WCAG 2.1 AA.
Always check:
- keyboard access
- visible focus
- semantic HTML
- labels and validation messages
- color contrast
- reduced motion
- screen-reader clarity
- touch target sizing

## Technical stack
Next.js App Router
TypeScript
Tailwind CSS (design tokens in `app/globals.css` under `@theme`; component classes live in `@layer components` so utilities can override them)
shadcn/ui patterns
Zod
Resend
Cloudflare Turnstile

Fonts: Schibsted Grotesk (headings, Norwegian typeface) and Inter (body), self-hosted in `app/fonts/` via `next/font/local`.

### Hero fiber scene
`components/home/fiber/fiber-scene.tsx` (server component) draws everything around one point: the compass centre. `.fiber-anchor` (globals.css) is a 0×0 element placed where the compass stands (mobile: in the free area above the text; desktop: 75 % / 70 % of the content width, 46 % of the hero height). The SVG, the impulses, the arrival ring and the compass are positioned from it, so the paths always meet the compass and keep their proportions at every screen size.
- Paths are defined as cubic Bézier segments in `DESKTOP` / `MOBILE`. `intoHub()` makes the incoming fibers run tight and parallel for the last 150 px, like one cable entering the compass. Gradient strokes fade in from the edge; one wide faint halo stroke and one 0.5 px white reflection on the main fibers. No filters, no blur. Painted once.
- Impulses: `geometry.ts` samples each path by arc length (eased) and builds `@keyframes` with `translate()` + `rotate()` at build time. Elements are 0×0 spans with a short gradient streak. Transform/opacity only, so the compositor animates them with no JS, layout or paint. The main impulse passes under the compass and continues out; `.fiber-ring` marks its arrival (keyframes in globals.css must stay in sync with the `from/to` fractions in fiber-scene.tsx: 0.42 desktop, 0.40 mobile).
- Impulses start only after `load` + idle (`data-fiber-live`, set by `hero-pointer.tsx`; never with reduced motion or Save-Data) and pause while the hero is off-screen (`data-observe="toggle"`). Reduced motion hides them.
- `hero-compass.tsx`: opaque disc, no backdrop-filter (a blurred translucent disc over an animation forced a full redraw every frame). `NEEDLE_REST` points along the outgoing fiber.
- `hero-pointer.tsx` is the only client piece: it starts the impulses and rotates the needle toward the mouse on desktop (`pointer: fine` + ≥1024 px). Compass position is measured with a ResizeObserver, the needle is written at most once per frame via `onFrame`, nothing runs while scrolling.
- Use longhand `animation-*` properties when an animation has no name in the rule: the CSS minifier turns a nameless `animation:` shorthand into `animation: none`.
GSAP, React Three Fiber, Motion, Lenis and WebGL are not used. Add libraries, canvas/WebGL or new continuous animation only with a concrete reason and the owner's go-ahead.

### Motion system
- Scrolling is the browser's own (runs on the compositor, stays smooth when JavaScript is busy). Lenis was removed in October 2026 because it drove every scroll frame from the main thread. Anchor links scroll smoothly via `scroll-behavior: smooth` on `<html>` (`data-scroll-behavior="smooth"` keeps route changes instant); reduced motion turns it off.
- Scroll reveals: add `data-reveal` (`fade`, `scale`, `clip`) or `data-split` (word-by-word headings via `SplitWords`). One shared IntersectionObserver (`components/ui/reveal-observer.tsx`) sets `data-inview`. Content is only hidden when JS runs (`js-reveal` class), and anything visible at load is shown instantly.
- `data-observe="toggle"` pauses CSS animations inside an element while it is off-screen. Always pair infinite CSS animations with it.
- Nothing runs per frame while the page scrolls: the header progress bar is a CSS scroll-driven animation (`animation-timeline: scroll()`, JS fallback only where unsupported), and the header's scrolled state is a passive scroll listener that writes only when the threshold is crossed.
- `lib/frame.ts` is the shared rAF loop for the few pointer animations (`onFrame`: compass needle, magnetic CTA). `onScroll({ measure, update })` is available for scroll-linked effects but currently only used as the progress-bar fallback; `update` may only write, never read layout. Never call `getBoundingClientRect` per scroll or pointer frame.
- Moving light (hero, positioning diagram, footer) uses transform/opacity keyframes, never `stroke-dashoffset`, SMIL or `filter`. Diagram impulses (`.route-dot`) are diagram-sized layers moved with percentage translates, so they follow the SVG's viewBox exactly.
- Pointer effects animate transform and opacity on their own layers. Do not animate box-shadow, filter, blur or gradient positions per frame.
- No `backdrop-filter` on elements that sit over moving content (header, hero compass): it must be recomputed every frame.
- Partner banner: CSS-only marquee (`.partner-track`, transform), the logo set duplicated once for a seamless −50 % loop, paused off-screen and on hover/focus, static wrapped row with reduced motion.
- Turnstile mounts when the contact form is within 800 px of the viewport; the chat script loads with `lazyOnload`.

## Commands
- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Git rules
- never force-push `main`
- use focused branches such as `feat/...`, `fix/...`, `refactor/...`, `chore/...`
- make small commits with clear messages
- before finishing a task, run typecheck and lint; run build when the change could affect production

## Working method
For meaningful tasks:
1. inspect the current implementation
2. briefly describe the plan
3. implement the smallest coherent change
4. verify it
5. report what changed and what remains

Do not rewrite working architecture without a concrete reason.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
