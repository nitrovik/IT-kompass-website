# IT Kompass AS – nettside

Nettsiden til IT Kompass AS, bygget med Next.js. Designet følger den godkjente forhåndsvisningen i `design/reference-homepage-preview.html`. Retningslinjene står i `HANDOFF.md` og `CLAUDE.md`.

## Sider

Nettsiden er bevisst holdt til én side, pluss personvernsiden som loven krever. Eieren fjernet tjenestesidene, prosjekter, om oss, support og veiviseren i oktober 2026 for å gjøre siden enklere.

| Adresse | Innhold |
| --- | --- |
| `/` | Forside: hero med fiberanimasjon og kontaktskjema (ankeret `/#kontakt`) |
| `/personvern` | Personvernerklæring (utkast, må gjennomgås) |

## Hvor endrer jeg tekst og informasjon?

- **Kontaktinfo, org.nr., dekningsområde:** `config/site.ts`
- **Tekster på forsiden:** `content/home.ts`
- **Personvern:** `content/legal.ts`
- **Bilder:** legg dem i `public/media/` (se README der)

Felt som står tomme (telefon, e-post, adresse) blir ikke vist på nettsiden. Det står altså aldri «settes inn senere» eller lignende ute på siden.

## Kjøre lokalt

Krever Node.js 20.9 eller nyere.

```bash
npm install
npm run dev        # http://localhost:3000
```

Uten miljøvariabler går skjemaene i testmodus lokalt. Innsendinger godtas, men det sendes ingen e-post.

## Kontroll før publisering

```bash
npm run typecheck
npm run lint
npm run build
```

## Teknologi

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod, Resend og Cloudflare Turnstile. Skriftene Schibsted Grotesk (overskrifter) og Inter (brødtekst) ligger lokalt i `app/fonts/` (SIL Open Font License).

Fiberscenen i heroen (`components/home/fiber/`) forteller det samme som diagrammet «Behovet avgjør»: behovet kommer inn, kompasset er knutepunktet, noen få grener går til alternativer, og én retning er den riktige. Små lysimpulser spiller av historien. De flyttes bare med transform, så skjermkortet gjør jobben alene, og keyframes lastes som en egen fil (`/motion.css`) etter at siden er ferdig. Tegningen ligger i `scene.ts`. Ved «redusert bevegelse» står alt stille. Se CLAUDE.md for detaljer.

Scrollingen er nettleserens egen. Ingenting kjører i JavaScript mens siden scroller.

Lighthouse (27. oktober 2026, lokal måling): mobil ytelse 95–96, PC 100. Tilgjengelighet, beste praksis og SEO: 100.

## Leverandørbanner

Under heroen kan det vises en rolig stripe med logoer fra leverandører dere jobber med. Den vises bare når det finnes bekreftede samarbeid.

1. Legg logoen i `public/partners/` (helst SVG).
2. Legg den inn i `content/partners.ts` med navn, filsti, bredde og høyde.
3. Se resultatet på `/forhandsvisning/partnere` før du publiserer.

## Publisering

Nettsiden publiseres på Railway. Steg for steg står i `PUBLISHING.md`.

## Mangler fra eier før lansering

- Telefon, e-post og adresse (`config/site.ts`)
- Gjennomgang av personvernerklæringen
- Kontoer og nøkler: Resend, Cloudflare Turnstile, og valgfritt Plausible
