/*
  Utkast til personvernerklæring. Må gjennomgås av IT Kompass AS før lansering,
  særlig punktene om lagringstid og hvilke tjenester som faktisk brukes.
*/
export type PrivacySection = { title: string; body: string[]; onlyWithAnalytics?: boolean };

export const privacyUpdated = "2026-10-03";

export const privacySections: PrivacySection[] = [
  {
    title: "Behandlingsansvarlig",
    body: ["IT Kompass AS (org.nr. 937 441 614) er behandlingsansvarlig for personopplysningene som samles inn via dette nettstedet."],
  },
  {
    title: "Hvilke opplysninger vi behandler",
    body: [
      "Når du sender inn kontaktskjema, supportsak eller bruker veiviseren, behandler vi opplysningene du selv oppgir: navn, virksomhet, e-postadresse, eventuelt telefonnummer og adresse, og det du skriver i meldingen. Legger du ved en fil i en supportsak, behandler vi også den.",
      "Vi bruker ikke informasjonskapsler (cookies) til markedsføring eller sporing.",
    ],
  },
  {
    title: "Hvorfor vi behandler dem",
    body: [
      "Opplysningene brukes til å svare på henvendelsen din, følge opp supportsaker og gi deg tilbud eller tjenester du ber om.",
      "Grunnlaget er at behandlingen er nødvendig for å gjennomføre tiltak du ber om før en eventuell avtale, eller for å oppfylle en avtale med deg eller virksomheten du representerer (personvernforordningen art. 6 nr. 1 bokstav b og f).",
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
    body: ["Vi lagrer henvendelser så lenge det er nødvendig for å følge opp saken eller kundeforholdet, og sletter dem når de ikke lenger trengs, med mindre lovpålagte krav tilsier noe annet."],
  },
  {
    title: "Dine rettigheter",
    body: [
      "Du har rett til innsyn i opplysningene vi har om deg, og til å be om retting eller sletting. Du kan også protestere mot behandlingen eller be om at den begrenses.",
      "Ta kontakt med oss via kontaktskjemaet hvis du vil bruke rettighetene dine. Mener du at vi behandler opplysninger i strid med regelverket, kan du klage til Datatilsynet.",
    ],
  },
];
