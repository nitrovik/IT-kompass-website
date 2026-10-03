import type { StatusState } from "@/content/status";

const stateLabel: Record<StatusState, string> = { operational: "I drift", degraded: "Redusert", incident: "Feil", unknown: "Ikke koblet" };

export function StatusBoard({ services }: { services: { name: string; state: StatusState; detail: string }[] }) {
  return <div className="grid gap-3">{services.map((service) => <div key={service.name} className="rounded-2xl border border-white/10 bg-[#0a1828] p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{service.name}</h2><p className="mt-2 text-sm text-slate-500">{service.detail}</p></div><span className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[.025] px-3 py-1 text-xs text-slate-300"><span className={`size-2 rounded-full ${service.state === "operational" ? "bg-[#5BE7A5]" : service.state === "degraded" ? "bg-[#FFD06B]" : service.state === "incident" ? "bg-[#FF6B7A]" : "bg-slate-500"}`} />{stateLabel[service.state]}</span></div></div>)}</div>;
}
