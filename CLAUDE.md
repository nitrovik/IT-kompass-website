**Text and copywriting:** Before writing or changing any text on the website, read and follow `SKRIVEREGLER.md`. It overrides any other writing guidance in this file.# IT Kompass AS – Claude Code project instructions

You are working on the website for IT Kompass AS, a Norwegian IT and telecom company.

## The user's level
The site owner is not a developer. Explain important changes in simple Norwegian when asked, avoid unnecessary jargon, and never assume technical knowledge.

## Source of truth for the current design
The current approved design (October 2026) is the owner's HTML file:
- `design/reference-homepage-v2.html` ("originale farger"): visual design, layout, typography, palette, spacing, buttons, navigation, icons, hero illustration, animations, hover states and breakpoints (1050 / 760 / 390 px)
- `public/brand/it-kompass-logo-web-opt.png` / `it-kompass-logo-web-inverse-opt.png`: the real logo in header and footer
- `HANDOFF.md`: what was adapted from the HTML file and why

The owner excluded two sections of the HTML file: «Nøytrale råd. Riktig løsning.» and «Slik fungerer det». Do not add them back or replace them with similar sections under other names, and do not link to `#samarbeid`. The HTML file's «Samarbeidspartner» panel is also not used; instead the owner asked (October 2026) for a slim partner strip under the hero (below).
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
1. Hero drawing: fibers run from the left screen edge, through the compass and out to the right edge over a dotted orbit grid; light balls run in along a fiber, are absorbed by the compass, the needle turns to a new fiber and the ball is sent out along it (see «Hero drawing» below). The needle follows a nearby mouse when the compass is idle.
2. Service index rows (/tjenester): white background fades in, the content slides 10 px in from both sides (transform, not padding), the round arrow turns blue and rotates −35°.
3. Buttons lift 3 px; arrows (↗) move up-right; nav links get an underline that grows.
4. Scroll reveals: fade + 19 px rise, 0.75 s, delays 0.08 s / 0.16 s.
5. Reduced motion: no light balls, the needle stands still, everything visible at once.

## Header and navigation (October 2026)
- `components/layout/site-header.tsx`: logo with the menu right next to it (Tjenester, Hvorfor IT Kompass, Kontakt) and «La oss snakke» on the right, on one line.
- «Tjenester» is a disclosure button (WAI-ARIA «disclosure navigation») with a panel listing every service page plus «Alle tjenester». Mouse: opens on hover with a 70 ms delay and closes 180 ms after leaving (an invisible bridge keeps it open on the way down); a click pins it open. Keyboard: Enter/Space toggles, Arrow Down enters the list, arrows/Home/End move, Escape closes and returns focus, focus leaving closes it. The panel animates with opacity/transform only.
- ≤ 760 px: the menu is a panel under the header; Tjenester expands as an accordion (tap, never hover); the CTA sits at the bottom of the panel. Touch targets ≥ 44 px.
- The service list comes from `servicesNav` in `content/services.ts`, passed from `app/layout.tsx` as props so the service texts stay out of the client bundle. `content/navigation.ts` holds the other links.
- Active page: `aria-current="page"` in the panel, and Tjenester is marked on all `/tjenester` pages. On pages with their own contact form (home and /tjenester…), Kontakt and «La oss snakke» link to `#kontakt` on the same page.

## Homepage structure
- header (above)
- hero (`components/home/hero.tsx`); «Se hva vi gjør» goes to `/tjenester`
- partner strip (`partners.tsx`, content in `content/partners.ts`), replacing the old proof bar (the three points «Nøytral rådgivning», «IT og telekom samlet», «Én kontakt…» are gone by the owner's request; do not bring them back elsewhere). «Våre samarbeidspartnere» + logos. Only confirmed partners with official logo files in `public/partners/`; without a logo file the name is shown in the site's own type (never an imitation of the logo). With one or two partners the row is static; from three (`PARTNER_MARQUEE_MIN`) it becomes a slow, seamless CSS marquee (the row twice, translated −50 %; the copy is `aria-hidden`), paused off-screen, on hover and with reduced motion. Today: GlobalConnect only; the official logo file is still missing.
- intro, `#hvorfor` (`intro-section.tsx`): text on the left, the needs illustration on the right (below on mobile). `components/home/needs-diagram.tsx` restores the earlier «Behovet avgjør» diagram (same geometry, texts and colours, from git history before #12): «Behovet ditt» → compass → four alternatives on a dark navy panel. Palette: the section has a light-blue surface (#f8fbff → #e5effa) and the panel a medium navy (#173866, lighter core #285492) with a white mat frame, lines in the hero's fiber blue (#8fb9e9), the active signal in the light-ball blue (#4c99eb → #8ec2f5); no separate cyan. A soft halo behind the panel ties it to the section. One alternative is highlighted at a time, drawn from a shuffled deck (all four per round, never the same twice in a row) every 4.6 s. Each switch toggles one `is-active` class; CSS delays sequence the pulse along the route, the needle turn, the lit route, the marker, the label and the «Riktig valg» badge (transform/opacity only; lit routes are their own layers). Paused off-screen and in hidden tabs; reduced motion shows alternative C fixed.
- contact, `#kontakt` (`contact-section.tsx`): the card holds the real contact form (`#kontaktskjema`) where the HTML file had a link to itkompass.no; «Utforsk tjenestene» goes to `/tjenester`
- footer: logo, «IT og telecom for bedrifter.», org.nr., personvern, «Til toppen»
The services list is no longer on the homepage (owner's request, October 2026): it lives on `/tjenester` and in the menu.

## Service pages (October 2026)
- `/tjenester` (`app/tjenester/page.tsx`): the editorial services index from the homepage design (`components/service/services-index.tsx`), each row linking to its page, plus the contact section.
- `/tjenester/[slug]` (`app/tjenester/[slug]/page.tsx`, static with `generateStaticParams`, `dynamicParams = false` so unknown slugs 404): `it-support`, `wifi`, `fiber-og-bredband`, `telefoni-og-sentralbord`, `nettsider`. Old slugs are kept where they existed; old URLs from the previous site redirect in `next.config.ts`.
- Content in `content/services.ts` (built on the site's earlier approved service texts, written per `SKRIVEREGLER.md`; no prices, guarantees, platforms or customers). Each page: hero with breadcrumbs and its own line drawing (`components/service/service-art.tsx`), «Dette gjør vi» in one of two layouts (`index`: numbered nodes along a fiber line; `split`: sticky heading and list), «Dette får dere», «Typiske behov» with its own heading, the contact section with the form's category preselected, and related services. Service JSON-LD and breadcrumbs JSON-LD; every page in the sitemap.
- Mobile/fixed-line telephony and the switchboard are one page, as the services are described today. Split them only if the owner provides content.

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
Website content belongs in `content/` data files whenever practical: `content/home.ts` (all homepage text, headings as `TitleLine` with an optional italic accent), `content/services.ts` (service pages and the services menu), `content/navigation.ts` (menu), `content/contact.ts` (form categories), `content/legal.ts` (personvern).
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

### Hero drawing (fibers and compass)
- `components/home/hero-art.tsx` (server component): the static parts inside `.hero-figure`: grid circles, axes and the caption (`.hero-caption`), the compass disc with ring, marks and N/S/W/E (`.hero-compass-core`, viewBox `250 160 200 200`), the centre glow (`.hero-core-glow`) and the needle as its own SVG (`.hero-needle`, rotated with `transform`). The compass does not drift, so the fibers stay attached to it.
- `components/home/hero-fibers.ts`: the geometry in hero pixels. The direction is always left → compass → right (owner, October 2026). PC: two fibers come in from the left edge (one above the text, the main one with the light highlight below it) and one from the top; four go out over the right edge. Mobile (text above the compass): in from the left below the text, out to the right. Seven fibers on PC, five on mobile; do not add more. Each fiber is a cubic Bézier plus a straight radial segment under the disc; its bearing is measured on the path itself at the disc rim. A fiber is valid only if its visible part stays clear of the hero text (+16 px) and the caption (+18 px). If not, the smallest working adjustment is chosen (end moved along the edge, heading turned up to ±18°, curve tightened), then a backup edge; otherwise it is left out.
- `components/home/hero-fiber-system.tsx` (client): measures hero, compass, text and caption on resize only (ResizeObserver, `document.fonts.ready`), draws the fibers (`.hero-fibers`), ports, nodes and three reusable light balls, and starts the controller after `load` + idle, never with reduced motion or Save-Data.
- `components/home/fiber-controller.ts`: one signal at a time, as a state machine `idle → absorbing → aiming → emitting → idle` (`data-fiber-phase` on the hero; `data-fiber-out` is the chosen exit):
  1. A ball arrives along an incoming fiber, slows down inside the disc and shrinks and fades into the centre, which glows briefly.
  2. The exit is drawn from a shuffled deck: every valid exit once per round in random order, and a round never starts with the last exit.
  3. The needle turns the shortest way to the exit's measured bearing. For this it uses `glide`: the damped spring is simulated ahead of time and played with the Web Animations API, so it runs on the compositor. The ball leaves only when the needle has settled (at most 1.8 s).
  4. The ball leaves from the centre, reaches full size at the rim and runs out over the screen edge. The next ball is launched from the edge during the emission, timed to arrive after a short pause, so the long fibers keep the old rhythm; the compass still takes one ball at a time.
  Balls move with the Web Animations API on transform/opacity. Keyframes are computed once per fiber and each ball/fiber animation is created once and replayed; JavaScript runs only at phase changes, and the centre glow is released from its computed timing (no style reads).
- Layers: `.hero-copy` has no z-index, so it paints below the animated layers and is never promoted; the pulses layer is on top. The glows (`.hero-glow`, `.hero-core-glow`) have `will-change: transform, opacity` so starting an animation never re-layerizes or repaints the big layer (measured: paint per phase change went from ~8 ms to ~3 ms).
- Hover (mouse only, `(hover: hover) and (pointer: fine)`): while idle the needle turns toward a pointer within 3.5 × the disc radius (released at 4.1 ×) and returns to the last exit when the pointer leaves. While absorbing, aiming or emitting, the signal direction wins. Following the pointer is the only per-frame JavaScript (the spring in requestAnimationFrame, only while the needle moves). Pointer handling uses cached coordinates, with no layout reads per move.
- Everything stops while the hero is off-screen (IntersectionObserver) or the tab is hidden, and resumes when visible.
- Use longhand `animation-*` properties when an animation has no name in the rule: the CSS minifier turns a nameless `animation:` shorthand into `animation: none`.

### Contact form
- `components/forms/contact-form.tsx`: category, name, email and message (same field names as before), sent with the server action `app/actions/contact.ts` (Zod, Turnstile, honeypot, Resend). The client checks the same rules as the server before sending. Errors appear under each field (`aria-invalid`, `aria-describedby`) and focus moves to the first one; server field errors (`fieldErrors`) are shown the same way, other server errors as an alert. The receipt appears only when the server answers `ok`.
- `components/forms/field.tsx`: `TextField`, `TextAreaField` and `SelectMenu`, a custom dropdown following the WAI-ARIA «select-only combobox» pattern (arrows, Home/End, Enter/Space, Escape, Tab, type to jump) with a hidden input carrying the value.

GSAP, React Three Fiber, Motion, Lenis and WebGL are not used. Add libraries, canvas/WebGL or new continuous animation only with a concrete reason and the owner's go-ahead.

### Motion system
- Scrolling is the browser's own. Anchor links scroll smoothly via `scroll-behavior: smooth` on `<html>` (`data-scroll-behavior="smooth"` keeps route changes instant), with `scroll-padding-top` 86 px (70 px on mobile) for the sticky header. Reduced motion turns it off.
- In the header, section links are plain anchors on the home page (so clicking the same `#kontakt` again still scrolls) and Next links to `/#…` from other pages.
- Scroll reveals: add `data-reveal` (optionally `--d` for delay). One shared IntersectionObserver (`components/ui/reveal-observer.tsx`) sets `data-inview`. Content is only hidden when JS runs (`js-reveal` class), and anything visible at load is shown instantly.
- `data-observe="toggle"` pauses CSS animations inside an element while it is off-screen. Always pair infinite CSS animations with it.
- Nothing runs in JavaScript while the page scrolls. The header is `position: sticky`.
- Moving light uses transform/opacity keyframes, never `stroke-dashoffset`, SMIL, `offset-path` or animated `filter`. Static SVG filters (glow) are fine inside layers that only move.
- No `backdrop-filter` on the header (it would be recomputed on every scroll frame): it uses an almost opaque white (`#fffffff5`) instead of the HTML file's blur. The small note top right in the hero keeps the design's blur (nothing moves beneath it).
- The services row hover (on /tjenester) and the header underlines use transforms, never padding or width, so hovering never triggers layout.
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
