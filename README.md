# IT Kompass AS – nettside

Nettsiden til IT Kompass AS, bygget med Next.js. Designet følger eierens HTML-design i `design/reference-homepage-v2.html` (originale farger), med logoen og kompasset til IT Kompass. Hva som er tilpasset og hvorfor, står i `HANDOFF.md`. Retningslinjene står i `CLAUDE.md`.

## Sider

Nettsiden er bevisst holdt til én side, pluss personvernsiden som loven krever. Eieren fjernet tjenestesidene, prosjekter, om oss, support og veiviseren i oktober 2026 for å gjøre siden enklere.

| Adresse | Innhold |
| --- | --- |
| `/` | Forside: hero med kompass og fibre, kort oppsummering, «Hvorfor IT Kompass» (`/#hvorfor`), tjenester (`/#tjenester`) og kontaktskjema (`/#kontakt`) |
| `/personvern` | Personvernerklæring (utkast, må gjennomgås) |

## Hvor endrer jeg tekst og informasjon?

- **Kontaktinfo, org.nr., dekningsområde:** `config/site.ts`
- **Tekster på forsiden:** `content/home.ts`
- **Menyen:** `content/navigation.ts`
- **Personvern:** `content/legal.ts`

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

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod, Resend og Cloudflare Turnstile. Skriften Inter ligger lokalt i `app/fonts/` (SIL Open Font License). De kursive aksentordene bruker en serif fra maskinen (Iowan Old Style, Palatino eller Georgia), som i designet.

Tegningen i heroen (`components/home/hero-art.tsx`) er tegningen fra designet: sju fibre som møtes i kompasset, tre lyssignaler som går langs fibrene og et kompass som svever rolig. Kompasset er det samme som i logoen. Signalene og kompasset flyttes bare med transform, så skjermkortet gjør jobben alene, og banene lastes som en egen fil (`/motion.css`) etter at siden er ferdig. Ved «redusert bevegelse» står alt stille.

Scrollingen er nettleserens egen. Ingenting kjører i JavaScript mens siden scroller.

Lighthouse: se siste måling i pull request-en for design v2.

## Publisering

Nettsiden publiseres på Railway. Steg for steg står i `PUBLISHING.md`.

## Mangler fra eier før lansering

- Telefon, e-post og adresse (`config/site.ts`)
- Gjennomgang av personvernerklæringen
- Kontoer og nøkler: Resend, Cloudflare Turnstile, og valgfritt Plausible
