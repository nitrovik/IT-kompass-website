# IT Kompass AS – Design and implementation handoff

## What this file is for
This is the design handoff for continuing the project with Claude Code.
The owner has approved the current visual direction and wants the implementation to match the supplied preview closely while keeping the site technically robust.

## Reference files
- `design/reference-homepage-preview.html` = latest standalone visual preview
- `design/design-reference-user.png` = original visual reference supplied by the owner
- `public/brand/it-kompass-logo.png` = supplied final transparent logo
- `public/brand/it-kompass-logo-web.png` = tightly cropped web-ready logo

## Visual target
The site should be light and premium, not predominantly dark.
Use a clear Scandinavian B2B style with:
- white/light-blue surfaces
- dark navy typography
- electric blue accents
- soft shadows
- subtle glass surfaces only where they add depth
- rounded but controlled corners
- generous whitespace

The distinctive brand layer is fiber optics + compass:
- animated fiber-optic cables in the hero background
- continuous moving light impulses through the fibers
- subtle glow/pulse
- restrained compass motif

The overall impression should be “high-end custom site” rather than a generic template or cyberpunk site.

## Hero
Headline:
`IT og telecom.`
`Én partner.`

Supporting message:
`Vi finner den beste løsningen for din bedrift, uavhengig av leverandør. Du får én kontaktperson for alt innen IT, telecom, fiber og nettverk.`

Primary CTA:
`Finn riktig løsning`

Secondary CTA:
`Ta kontakt`

Service quick-links:
- WiFi
- Fiber og telecom
- IT support
- Nettsider og drift

Hero details:
- light visual background with fiber-optic cables
- moving light impulses along fiber paths
- subtle depth and pointer response on desktop
- no heavy sci-fi look
- static fallback for mobile/reduced-motion/weak devices

## Service cards
Cards:
1. WiFi
2. Fiber og telecom
3. IT support
4. Nettsider og drift

Each card should have:
- icon
- concise heading
- concise description
- “Les mer” link
- subtle hover lift
- pointer-following spotlight
- subtle luminous edge
- optional tiny tilt on desktop

The spotlight is an important premium interaction and should feel smooth rather than gimmicky.

## Supplier independence section
Core message:
`Riktig løsning først. Leverandør etterpå.`

Explain clearly that IT Kompass starts with the customer’s needs and can evaluate solutions across IT and telecom without locking the customer to one supplier.

Supporting points:
- Objektiv rådgivning
- Én kontakt
- Lokal nærhet
- Langsiktig samarbeid

Use real imagery when available. Current preview contains a visual placeholder that should later be replaced by an authentic client/team/installation photo supplied by the owner.

## Process section
Four steps:
01 Forstå behovet
02 Finne riktig løsning
03 Sette det opp
04 Følge det opp

Use a subtle visual connection between steps, ideally with the fiber/light language.

## Websites showcase
This site is also a product showcase for websites IT Kompass sells.
It should visibly demonstrate quality.

Use:
- laptop frame
- mobile frame
- clean UI placeholders until real portfolio images are supplied

Packages:
- Start
- Pro
- Premium

Price should remain `Pris kommer` until real prices are provided.

## “Finn riktig løsning” CTA
This is an important conversion element.
Make it visually distinctive but consistent with the rest of the site.
It should feel like a guided tool, not a generic contact button.

## Contact section
Should contain:
- short intro copy
- category selector
- name
- email
- message
- coverage map placeholder
- future meeting booking integration

Categories:
- Fiber/WiFi
- Mobil
- IT support
- Utstyr
- Installasjoner
- Nettsider

## Footer
Must include placeholders until real information is supplied:
- IT Kompass AS
- Org.nr. 937 441 614
- address
- phone
- email
- navigation
- personvern / vilkår

Do not invent missing business details.

## Important responsive behavior
Desktop gets the richest interactions.
Mobile should keep the visual identity but remove expensive pointer/tilt/3D effects where appropriate.
Navigation becomes a clean mobile menu.

## Reduced motion
When `prefers-reduced-motion: reduce` is active:
- stop continuous fiber animation
- remove pointer tilt
- disable nonessential reveal choreography
- keep the page fully understandable and visually complete

## Success criteria
The implementation should feel:
- light
- premium
- modern
- trustworthy
- distinctly IT Kompass
- noticeably more polished than a generic agency template

It should not feel:
- dark/cyberpunk
- overly flashy
- neon-heavy
- like a stock website template

## Do not change without approval
Do not independently change:
- brand direction
- logo
- light/dark balance
- headline direction
- key CTA hierarchy
- four service areas
- supplier-independent positioning
