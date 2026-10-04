export type ServiceIconKey = "wifi" | "fiber-og-telecom" | "it-support" | "nettsider";

export type ServiceCardData = {
  title: string;
  description: string;
  href: string;
  icon: ServiceIconKey;
  bullets?: string[];
};
