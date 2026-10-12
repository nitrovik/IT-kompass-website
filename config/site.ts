export const site = {
  name: "IT Kompass AS",
  legalName: "IT Kompass AS",
  domain: "itkompass.no",
  // Hovedadressen er www: Gigahost tillater ikke at domenet uten www pekes til Railway (CNAME)
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.itkompass.no",
  orgNumber: "937 441 614",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  country: "NO",
  // Bekreftet av eier (oktober 2026): fysisk arbeid i Viken, digitalt i hele Norge
  coverageArea: "På stedet i Viken. Digitalt i hele Norge.",
  areaServed: ["Viken", "Norge"],
  description: "IT og telecom for bedrifter i Viken og hele Norge. Vi sammenligner leverandørene, og du får en fast kontaktperson.",
  bookingUrl: process.env.NEXT_PUBLIC_CAL_URL || "",
  remoteHelpUrl: process.env.REMOTE_HELP_URL || "",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
};

export const navItems = [
  { href: "/tjenester", label: "Tjenester" },
  { href: "/prosjekter", label: "Prosjekter" },
  { href: "/om-oss", label: "Om oss" },
  { href: "/support", label: "Support" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const socialLinks = [] as const;
