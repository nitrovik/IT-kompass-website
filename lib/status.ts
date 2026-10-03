import type { StatusState } from "@/content/status";

type RemoteStatus = { name: string; state: StatusState; detail?: string };
export type StatusService = { name: string; state: StatusState; detail: string };

/*
  Henter live driftsstatus når STATUS_API_URL er satt. Uten koblet kilde returneres
  null, og statusflaten skjules, slik at nettsiden aldri viser en oppdiktet status.
*/
export async function getStatusServices(): Promise<StatusService[] | null> {
  const endpoint = process.env.STATUS_API_URL;
  if (!endpoint) return null;
  try {
    const response = await fetch(endpoint, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    const data = (await response.json()) as { services?: RemoteStatus[] };
    return Array.isArray(data.services) && data.services.length
      ? data.services.map((item) => ({ name: item.name, state: item.state, detail: item.detail ?? "" }))
      : null;
  } catch {
    return null;
  }
}
