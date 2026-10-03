import type { StatusState } from "@/content/status";
import type { StatusService } from "@/lib/status";
import { cn } from "@/lib/utils";

const stateLabel: Record<StatusState, string> = { operational: "I drift", degraded: "Redusert", incident: "Feil", unknown: "Ukjent" };
const stateDot: Record<StatusState, string> = { operational: "bg-[#2e9e5b]", degraded: "bg-[#d99a1e]", incident: "bg-danger", unknown: "bg-[#8ea7c0]" };

export function StatusBoard({ services }: { services: StatusService[] }) {
  return (
    <ul className="grid gap-3">
      {services.map((service) => (
        <li key={service.name} className="flex items-start justify-between gap-4 rounded-2xl border border-line bg-white p-5">
          <div>
            <h3 className="font-bold text-ink">{service.name}</h3>
            {service.detail ? <p className="mt-1 text-sm text-muted">{service.detail}</p> : null}
          </div>
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-soft px-3 py-1 text-xs font-bold text-body">
            <span className={cn("size-2 rounded-full", stateDot[service.state])} aria-hidden="true" />
            {stateLabel[service.state]}
          </span>
        </li>
      ))}
    </ul>
  );
}
