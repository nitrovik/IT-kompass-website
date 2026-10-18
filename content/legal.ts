/*
  Utkast til personvernerklæring. Må gjennomgås av IT Kompass AS før lansering,
  særlig punktene om lagringstid og hvilke tjenester som faktisk brukes.
*/
export type PrivacySection = { title: string; body: string[]; onlyWithAnalytics?: boolean };

export const privacyUpdated = "2026-10-18";

export const privacySections: PrivacySection[] = [
  {
    title: "Behandlingsansvarlig",
    body: ["IT Kompass AS (org.nr. 937 441 614) er behandlingsansvarlig for personopplysningene som samles inn via dette nettstedet."],
  },
  {
    title: "Hvilke opplysninger vi behandler",
    body: [
      "Vi behandler det du selv fyller inn i kontaktskjemaet. Det er navn, virksomhet, e-postadresse, eventuelt telefonnummer og adresse, og meldingen din.",
      "Vi bruker ikke informasjonskapsler (cookies) til markedsføring eller sporing.",
    ],
  },
  {
    title: "Hvorfor vi behandler dem",
    body: [
      "Vi bruker opplysningene til å svare deg og gi deg tilbud eller tjenester du ber om.",
      "Grunnlaget er at behandlingen er nødvendig for det du ber om før en eventuell avtale, eller for å oppfylle en avtale med deg eller virksomheten din. Se personvernforordningen art. 6 nr. 1 bokstav b og f.",
    ],
  },
  {
    title: "Tjenester vi bruker",
    body: [
      "Skjemaene sendes til oss som e-post via Resend. Cloudflare Turnstile brukes for å stoppe spam og automatiserte innsendinger. Disse leverandørene behandler opplysningene på våre vegne.",
    ],
  },
  {
    title: "Besøksstatistikk",
    onlyWithAnalytics: true,
    body: ["Vi bruker Plausible for å se anonym besøksstatistikk. Plausible bruker ikke informasjonskapsler og lagrer ikke opplysninger som kan identifisere deg."],
  },
  {
    title: "Hvor lenge vi lagrer opplysningene",
    body: ["Vi lagrer henvendelser så lenge vi trenger dem for å følge opp saken eller kundeforholdet. Deretter sletter vi dem, med mindre loven krever at vi lagrer dem lenger."],
  },
  {
    title: "Dine rettigheter",
    body: [
      "Du har rett til innsyn i opplysningene vi har om deg, og til å be om retting eller sletting. Du kan også protestere mot behandlingen eller be om at den begrenses.",
      "Bruk kontaktskjemaet hvis du vil bruke rettighetene dine. Mener du at vi bryter regelverket, kan du klage til Datatilsynet.",
    ],
  },
];
