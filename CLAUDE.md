**Text and copywriting:** Before writing or changing any text on the website, read and follow `SKRIVEREGLER.md`. It overrides any other writing guidance in this file.# IT Kompass AS – Claude Code project instructions

You are working on the website for IT Kompass AS, a Norwegian IT and telecom company.

## The user's level
The site owner is not a developer. Explain important changes in simple Norwegian when asked, avoid unnecessary jargon, and never assume technical knowledge.

## Source of truth for the current design
The current approved design (October 2026) is the owner's HTML file:
- `design/reference-homepage-v2.html` ("originale farger"): visual design, layout, typography, palette, spacing, buttons, navigation, icons, hero illustration, animations, hover states and breakpoints (1050 / 760 / 390 px)
- `public/brand/it-kompass-logo-web-opt.png` / `it-kompass-logo-web-inverse-opt.png`: the real logo in header and footer
- `HANDOFF.md`: what was adapted from the HTML file and why

The owner excluded three sections of the HTML file: «Samarbeidspartner» (GlobalConnect), «Nøytrale råd. Riktig løsning.» and «Slik fungerer det». Do not add them back or replace them with similar sections under other names, and do not link to `#samarbeid`.
`design/design-reference-user.png` is the owner's original inspiration from before v2 (historical; do not copy its partner logos or invented details).

Do not redesign. Match the HTML file; where it conflicts with functionality (contact form, links to itkompass.no), keep the functionality and stay as close to the design as possible.

## Brand direction
- predominantly light UI: white and very light blue surfaces (`#f4f8fc`, hero gradient `#fbfcfe → #e9f2fc`)
- navy `#10223d` for typography, `#0b213c` for the footer, blue `#2369cf` as the accent
- Inter for all text; italic serif accent words (`--serif`: Iowan Old Style, Palatino, Georgia) in blue
- square-ish buttons (3 px radius), thin lines, editorial layout
- the compass + fiber drawing in the hero is the visual signature
- avoid an overly dark, cyberpunk or sci-fi look

## Logo and compass
The logo and the compass are primary brand assets. The owner asked in October 2026 that they never disappear.
- Header: `public/brand/it-kompass-logo-web-opt.png` (60 px high, 52 px on mobile). Footer: `it-kompass-logo-web-inverse-opt.png`. Keep proportions (414 × 148). Do not recreate the logo with CSS or replace it with the HTML file's SVG mark.
- The compass in the centre of the hero drawing is the compass from the logo (ring with four marks, navy north needle `#0b2545`, teal south needle `#237286`), placed on the design's disc with halo and N/S/W/E letters.
- The favicon (`app/icon.png`) and the 404 page also use the compass.

## Signature interactions (from the HTML file)
1. Hero drawing (`components/home/hero-art.tsx`): seven fibers through a dotted orbit grid, the compass hub floating 5 units up and down (8 s), three light signals running along three of the fibers (7.5 s, delays 0 / −2.5 / −5 s), four nodes, two notes and a caption.
2. Service index rows: white background fades in, padding widens, the round arrow turns blue and rotates −35°.
3. Buttons lift 3 px; arrows (↗) move up-right; nav links get an underline that grows.
4. Scroll reveals: fade + 19 px rise, 0.75 s, delays 0.08 s / 0.16 s.
5. Reduced motion: no signals, no drift, everything visible at once.

## Homepage structure
- header: logo, Tjenester (`#tjenester`), Hvorfor IT Kompass (`#hvorfor`), Kontakt (`#kontakt`), «La oss snakke»; on ≤760 px a dropdown menu
- hero (`components/home/hero.tsx`)
- proof bar (`proof-bar.tsx`)
- intro, `#hvorfor` (`intro-section.tsx`)
- services index, `#tjenester` (`services-section.tsx`); every row goes to the contact form
- contact, `#kontakt` (`contact-section.tsx`): the card holds the real contact form (`#kontaktskjema`) where the HTML file had a link to itkompass.no
- footer: logo, «IT og telecom for bedrifter.», org.nr., personvern, «Til toppen»

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
Website content belongs in `content/` data files whenever practical: `content/home.ts` (all homepage text, headings as `TitleLine` with an optional italic accent), `content/navigation.ts` (menu), `content/legal.ts` (personvern).
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

Fonts: Inter, self-hosted in `app/fonts/` via `next/font/local`. `inter-arrow-wght.woff2` holds only the ↗ glyph from full Inter (missing from the Latin subset), loaded with `unicode-range: U+2197`. The serif accent font is a system font stack, as in the HTML file.

### Hero drawing
- `components/home/hero-signals.ts`: the drawing as data in the HTML file's viewBox (700 × 520): `FIBERS`, `HIGHLIGHT`, `NODES`, `SIGNALS`. The HTML file moved the signals with `offset-path` on SVG circles, which repaints the SVG every frame. Here the paths are parsed (absolute M/C/S) and sampled by arc length at build time into transform/opacity keyframes (`hero-signal-1…3`), with the same timing (linear, opacity ramps at 8 % and 88 %).
- `components/home/hero-art.tsx` (server component) draws the same picture in layers inside `.hero-figure`: a static SVG (grid, fibers, highlight, ring text), the compass as its own small SVG (`.hero-compass-core`, viewBox `250 160 200 200`, drift = `translateY(-2.5%)`), three signal layers the size of the drawing moved with percentage translates, and the nodes on top.
- Signal keyframes are served as the static, fingerprinted file `/motion.css` (`app/motion.css/route.ts`, `components/home/motion-css.ts`), not inline (inline keyframes were parsed twice via the RSC payload and raised mobile TBT). `hero-motion.tsx` is the only client piece: after `load` + idle it adds `/motion.css` and sets `data-motion-live` (never with reduced motion or Save-Data). Without the file the signals stay hidden.
- The hero has `data-observe="toggle"`; drift and signals pause while it is off-screen.
- Use longhand `animation-*` properties when an animation has no name in the rule: the CSS minifier turns a nameless `animation:` shorthand into `animation: none`.
GSAP, React Three Fiber, Motion, Lenis and WebGL are not used. Add libraries, canvas/WebGL or new continuous animation only with a concrete reason and the owner's go-ahead.

### Motion system
- Scrolling is the browser's own. Anchor links scroll smoothly via `scroll-behavior: smooth` on `<html>` (`data-scroll-behavior="smooth"` keeps route changes instant), with `scroll-padding-top` 86 px (70 px on mobile) for the sticky header. Reduced motion turns it off.
- In the header, section links are plain anchors on the home page (so clicking the same `#kontakt` again still scrolls) and Next links to `/#…` from other pages.
- Scroll reveals: add `data-reveal` (optionally `--d` for delay). One shared IntersectionObserver (`components/ui/reveal-observer.tsx`) sets `data-inview`. Content is only hidden when JS runs (`js-reveal` class), and anything visible at load is shown instantly.
- `data-observe="toggle"` pauses CSS animations inside an element while it is off-screen. Always pair infinite CSS animations with it.
- Nothing runs in JavaScript while the page scrolls. The header is `position: sticky`.
- Moving light uses transform/opacity keyframes, never `stroke-dashoffset`, SMIL, `offset-path` or animated `filter`. Static SVG filters (glow) are fine inside layers that only move.
- No `backdrop-filter` on the header (it would be recomputed on every scroll frame): it uses an almost opaque white (`#fffffff5`) instead of the HTML file's blur. The small note top right in the hero keeps the design's blur (nothing moves beneath it).
- The services row hover changes padding as in the HTML file; it is hover-only on four rows.
- Turnstile mounts when the contact form is within 800 px of the viewport; the chat script loads with `lazyOnload`. The footer content keeps 64 px free on the right below 1440 px so the chat button never covers its links.

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
