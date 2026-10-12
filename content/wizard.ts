export const wizardSteps = [
  { key: "need", title: "Hva trenger du?", options: ["WiFi", "Fiber og telecom", "IT support", "Nettsider", "Vet ikke ennå"] },
  { key: "employees", title: "Hvor mange ansatte er dere?", options: ["1–5", "6–20", "21–50", "51+"] },
  { key: "urgency", title: "Når trenger du hjelp?", options: ["Så snart som mulig", "Denne måneden", "Vi planlegger", "Vet ikke ennå"] },
] as const;

export function getRecommendation(need?: string, employees?: string) {
  if (need === "Nettsider") return employees === "1–5" ? "Nettsider: Start-pakken" : "Nettsider: Pro-pakken";
  if (need === "WiFi") return "WiFi: kartlegging og planlegging";
  if (need === "Fiber og telecom") return "Fiber og telecom: sjekk av adressen og behovet";
  if (need === "IT support") return "IT support: drift og hjelp til ansatte";
  return "En prat om hva dere trenger";
}
