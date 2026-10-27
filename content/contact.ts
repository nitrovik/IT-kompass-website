/* Valgene i «Hva gjelder det?» i kontaktskjemaet. Tjenestesidene forhåndsvelger ett av dem. */
export const contactCategories = ["Fiber/WiFi", "Mobil", "IT support", "Utstyr", "Installasjoner", "Nettsider"] as const;
export type ContactCategory = (typeof contactCategories)[number];
