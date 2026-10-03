# IT Kompass AS – Claude Code project instructions

You are working on the website for IT Kompass AS, a Norwegian IT and telecom company.

## The user's level
The site owner is not a developer. Explain important changes in simple Norwegian when asked, avoid unnecessary jargon, and never assume technical knowledge.

## Source of truth for the current design
The current approved visual direction is documented in:
- `HANDOFF.md`
- `design/reference-homepage-preview.html`
- `design/design-reference-user.png` (owner's original inspiration; it contains invented details such as "Viken" and partner logos that must NOT be copied)
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

1. Hero fiber animation
- continuous, calm fiber-optic cable motion
- light impulses should travel through the cable paths continuously
- subtle glow/pulse around light points
- pointer interaction can softly influence the fiber scene on capable desktop devices
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
- avoid excessive continuous animations outside the fiber scene

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
- services
- supplier-independent explanation / why IT Kompass
- process / how we work
- website showcase and website packages
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

No references to Viken.
No lorem ipsum.
All content should be Norwegian Bokmål and concise.

## Content architecture
Website content belongs in `content/` data files whenever practical.
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
Tailwind CSS (design tokens in `app/globals.css` under `@theme`)
shadcn/ui patterns
Motion
Lenis
Zod
Resend
Cloudflare Turnstile

The hero fiber scene is SVG + CSS (`components/site/fiber-field.tsx`), not Three.js. It matches the approved preview, costs almost nothing to load, and is static on mobile and with reduced motion. GSAP and React Three Fiber were removed because nothing used them after that change. Add them back only with a concrete reason.

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
