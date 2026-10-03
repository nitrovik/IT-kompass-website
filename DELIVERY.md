# IT Kompass AS – ferdig leveranse

Alle syv arbeidsfaser er implementert i dette prosjektet.

## Fase 1 – konsept

Visuell retning er gjennomført som «Lys som finner veien» med mørk marine, elektrisk blå, fiber-/nettverkstema og kompasset som interaksjonell signatur. Designsprinsipper og sidekart er beskrevet i README og kodifisert i tokens og komponenter.

## Fase 2 – prosjektoppsett og felles layout

Felles App Router-layout, header, mobilmeny, footer, skip-link, fokusstiler, reduced-motion og designtokens er implementert.

## Fase 3 – forside

Hero, lazy-loaded 3D-fiberscene, statisk fallback, ordvis avdekking, spotlight/tilt-kort, magnetiske CTA-er, prosesslinje, kompassindikator, prosjekt-/nettsideutstilling og partnerplassholdere er implementert.

## Fase 4 – undersider

Tjenester med individuelle undersider, prosjekter, pakker, om oss, support, kontakt, personvern, veiviser og global 404 er implementert.

## Fase 5 – skjemaer, veiviser, SEO og personvern

Server Actions, Zod-validering, Resend, Turnstile server-side validering, vedlegg i supportsak, løsningsveiviser, metadata, sitemap, robots, JSON-LD LocalBusiness og Plausible-klargjøring er implementert.

## Fase 6 – sluttkontroll, README og zip

README, PUBLISHING.md, PROJECT_AUDIT.md og denne leveransefilen følger med. Kodebasen er syntax-kontrollert uten parse-feil. Full npm install/build ble ikke mulig i dette arbeidsmiljøet fordi npm-registrykall tidsavbrøt, så prosjektet er ikke presentert som lokalt build-verifisert.

## Fase 7 – publisering

PUBLISHING.md beskriver kravene for Node/Next-hosting, DNS-kobling mot Gigahost, Resend, Turnstile, Cal.com, fjernhjelp og Plausible.

## Ikke oppdiktede data

Faktisk logo-SVG, telefon, e-post, adresse, dekningsområde, partnernavn, kundesitater, ekte prosjektbilder, fjernhjelps-URL og booking-URL var ikke tilgjengelig i arbeidsgrunnlaget. Prosjektet bruker derfor tydelige, sentraliserte placeholders for disse verdiene i stedet for å finne på informasjon.
