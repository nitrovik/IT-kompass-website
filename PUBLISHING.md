# Publisering og domene

## Rimelig hosting for kommersiell bruk

Nettsiden bruker Next.js med server actions. Velg derfor en host som støtter Node.js/Next.js og kommersiell bruk. Et enkelt alternativ er en host som kan kjøre en standard Next.js deployment. Et statisk webhotell alene er ikke nok fordi skjemaene bruker server-side funksjoner.

## Før publisering

1. Legg inn logo i `public/brand/logo.svg`.
2. Fyll ut telefon, e-post, adresse, postnummer og sted i `config/site.ts`.
3. Fyll inn `.env`-verdiene fra `.env.example`.
4. Opprett Turnstile-site og secret key hos Cloudflare.
5. Verifiser `RESEND_FROM` og `CONTACT_RECIPIENT` i Resend.
6. Legg inn Cal.com-lenke i `NEXT_PUBLIC_CAL_URL`.
7. Legg inn fjernhjelpslenke i `REMOTE_HELP_URL`.
8. Opprett Plausible-site for `itkompass.no` og fyll inn `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
9. Legg inn ekte prosjektbilder og bekreftede partnerlogoer.
10. Bekreft personverninnhold og konkrete sletterutiner før lansering.

## Gigahost

Domenet kan bli liggende hos Gigahost selv om selve nettsiden hostes et annet sted. På hosten du velger får du vanligvis en produksjons-URL. I Gigahosts DNS-administrasjon kobler du domenet til hostens oppgitte DNS-poster.

Bruk hostens eksakte DNS-verdier. Ikke kopier eksempler fra denne filen, fordi målverdiene varierer mellom tilbydere.

Vanligvis må du håndtere:

- `@` for hoveddomenet `itkompass.no`
- `www` for `www.itkompass.no`
- Eventuelt en `CNAME` eller `A`-post som hosten oppgir

Etter DNS-endringen må HTTPS utstedes av hosten, og begge versjoner bør videresendes til hoveddomenet.

## Skjema og e-post

Produksjonsskjemaene krever:

- Resend API key
- Bekreftet fra-adresse
- Mottakeradresse
- Turnstile site key + secret key

Turnstile-token må valideres på serveren før innsending godtas.

## Analyse

Plausible er valgt fordi integrasjonen kan kjøre uten informasjonskapsler. Aktiver kun scriptet når domene og personverninformasjon er bekreftet.

## Siste kontroll før lansering

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

Deretter kjører du en lokal produksjonsserver med:

```bash
npm start
```

Test minst:

- mobilmeny
- alle navigasjonslenker
- kontaktskjema
- supportskjema og vedlegg
- veiviseren
- møtebooking
- fjernhjelpslenke
- sitemap.xml
- robots.txt
- 404
- redusert bevegelse
- tastaturnavigasjon
- mobil og stor skjerm

## DNS hos Gigahost

Logg inn i Gigahost sitt kontrollpanel og åpne DNS-administrasjonen for `itkompass.no`. Opprett eller endre postene hostingleverandøren oppgir for rot-domenet og `www`. La eksisterende e-post-DNS-poster være urørt med mindre samme leverandør faktisk skal håndtere e-post.
