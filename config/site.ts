export const site = {
  name: "IT Kompass AS",
  legalName: "IT Kompass AS",
  domain: "itkompass.no",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://itkompass.no",
  orgNumber: "937 441 614",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  country: "NO",
  coverageArea: "",
  description:
    "Nøytral partner innen IT og telecom for små og mellomstore bedrifter. Vi finner riktig løsning uavhengig av leverandør, og kunden har én kontakt for alt.",
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
