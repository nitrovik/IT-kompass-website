# IT Kompass AS – Design handoff (design v2, October 2026)

## What this file is for
The owner supplied a finished HTML design and asked for it to be implemented exactly in the existing site, with the original colors. This file records what the source of truth is, what was left out, and where the implementation deliberately differs from the HTML file and why.

## Reference files
- `design/reference-homepage-v2.html`: the owner's HTML design ("originale farger"). Source of truth for layout, typography, palette, spacing, buttons, navigation, icons, hero illustration, animations, hover states and responsive behavior.
- `public/brand/it-kompass-logo-web-opt.png` and `it-kompass-logo-web-inverse-opt.png`: the real logo, used in header and footer.
- `design/design-reference-user.png`: the owner's earlier inspiration (historical).

## Sections
Implemented, in this order:
1. Header: logo, Tjenester, Hvorfor IT Kompass, Kontakt, «La oss snakke»
2. Hero: «Vi drifter. / Du driver.», two buttons, assurance line, compass and fiber drawing with caption
3. Proof bar: «En partner. Flere fagområder.» and three points
4. Intro (`#hvorfor`): «Vi hjelper deg å velge riktig.»
5. Services index (`#tjenester`): IT, WiFi, Fiber, Tale
6. Contact (`#kontakt`): copy and a card with the contact form
7. Footer

Left out on the owner's instruction (October 2026), with no replacement sections and no links:
- «Samarbeidspartner» (GlobalConnect section and logo, nav link `#samarbeid`)
- «Nøytrale råd. Riktig løsning.»
- «Slik fungerer det»

The earlier partner logo banner (`content/partners.ts`, `/forhandsvisning/partnere`) was removed for the same reason.

## Deliberate differences from the HTML file
- **Logo:** the HTML file had an SVG mark with the text «IT KOMPASS / IT OG TELECOM». The owner asked that the real logo never disappears, so header and footer use the logo files.
- **Compass in the hero:** the owner asked that their compass stays. The centre of the drawing is the compass from the logo (ring with four marks, navy and teal needle) on the design's disc, halo and N/S/W/E letters. Everything else in the drawing is unchanged.
- **Contact card:** the HTML file linked to itkompass.no (this site) with «Gå til IT Kompass» and «Besøk itkompass.no». The card now holds the real contact form (Resend + Turnstile), and the button beside it says «Send oss en melding» and goes to the form. «Utforsk tjenestene» is kept.
- **Footer:** also shows org.nr., a link to personvern, and phone/email/address when they are filled in `config/site.ts`.
- **Header background:** almost opaque white instead of `backdrop-filter: blur`, so scrolling stays smooth. Looks the same.
- **Hero motion (further development, October 2026):** the fibers now run to the screen edges, and the compass absorbs a light ball, turns its needle to a new fiber and sends the ball out along it. The needle follows a nearby mouse when idle. The compass no longer drifts, so the fibers stay attached to it. Details in CLAUDE.md, «Hero drawing».
- **Contact form (October 2026):** new visual design with permanent labels, inline errors and a custom dropdown with keyboard and screen-reader support. Same fields and the same sending (Resend, Turnstile).
- **«Snakk med oss» under the services:** in the HTML file the decorative circles covered most of this link. It now sits above them.
- **Chat button:** the chatbot's round button is not part of the HTML file. The footer leaves room on the right so it never covers links.

## Text
All text is the owner's text from the HTML file, unchanged. Some phrases break `SKRIVEREGLER.md` (for example «løsninger», «partner», a dash mid-sentence). They were kept because the owner supplied this text as the finished design. New text added for function («Send oss en melding», footer line) follows the writing rules.

## Do not change without approval
- the design (layout, colors, typography, illustration)
- the logo and the compass
- the three excluded sections stay out

## October 2026: navigation, service pages and performance
- **Header:** logo and menu on one line to the left, «La oss snakke» to the right. «Tjenester» opens a submenu with every service page (mouse, keyboard and touch). Mobile: panel with an expandable service list.
- **Services moved off the homepage:** the index now lives on `/tjenester`, and each service has its own page (`/tjenester/[slug]`), including the new «Nettsider». Content in `content/services.ts`, based on the earlier approved service texts. Old URLs from the previous site redirect (`next.config.ts`).
- **Hero composition:** fibers come in from the left edge (above and below the text, one from the top) and go out over the right edge. Same number of fibers as before.
- **Performance (measured with Chrome tracing, before → after, 1440 px):** dropped frames in the hero 0.9 % → 0 %; paint per phase change ~8 → ~3 ms; scrolling paint 40 → 5 ms and layouts 31 → 5; mobile Lighthouse TBT 160 → 20 ms. The needle's turn to a new exit now runs on the compositor (Web Animations), animations are cached, layers are stable.

