import { statusServices, type StatusState } from "@/content/status";

type RemoteStatus = { name: string; state: StatusState; detail?: string };

export async function getStatusServices() {
  const endpoint = process.env.STATUS_API_URL;
  if (!endpoint) return statusServices;
  try {
    const response = await fetch(endpoint, { next: { revalidate: 60 } });
    if (!response.ok) return statusServices;
    const data = (await response.json()) as { services?: RemoteStatus[] };
    return Array.isArray(data.services) && data.services.length
      ? data.services.map((item) => ({ name: item.name, state: item.state, detail: item.detail ?? "Live status mottatt." }))
      : statusServices;
  } catch {
    return statusServices;
  }
}
