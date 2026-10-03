export type StatusState = "operational" | "degraded" | "incident" | "unknown";

export const statusOverview = {
  title: "Driftsstatus",
  intro: "Her kan vi koble på live statusdata når valgt driftssystem er klart.",
  updatedAt: null as string | null,
};

export const statusServices = [
  { name: "Nettverk og WiFi", state: "unknown" as StatusState, detail: "Live status er ikke koblet til ennå." },
  { name: "Fiber og bredbånd", state: "unknown" as StatusState, detail: "Live status er ikke koblet til ennå." },
  { name: "Telefoni", state: "unknown" as StatusState, detail: "Live status er ikke koblet til ennå." },
  { name: "IT support", state: "unknown" as StatusState, detail: "Live status er ikke koblet til ennå." },
];
