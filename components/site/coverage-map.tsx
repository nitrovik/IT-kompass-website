import { MapPin } from "lucide-react";
import { site } from "@/config/site";

/* Kartplassholder. Det faktiske dekningsområdet settes i config/site.ts (coverageArea) – aldri gjettet. */
export function CoverageMap({ title, fallback, className = "" }: { title: string; fallback: string; className?: string }) {
  return (
    <div className={`surface-card p-4 sm:p-5 ${className}`}>
      <div className="map-surface relative h-full min-h-[300px] overflow-hidden rounded-[17px]" role="img" aria-label="Illustrasjon av kart">
        <div className="absolute inset-x-[12%] top-[22%] h-[44%] rounded-[40%_60%_52%_48%] border-2 border-dashed border-brand/30" aria-hidden="true" />
        <div className="absolute top-[34%] left-[55%] grid size-14 place-items-center rounded-full border border-[#b4d2ea] bg-white text-brand shadow-[0_12px_24px_rgba(26,83,125,.14)]" aria-hidden="true"><MapPin size={22} /></div>
        <div className="absolute inset-x-4 bottom-4 rounded-[15px] bg-white/92 px-4 py-3.5 shadow-[0_12px_28px_rgba(26,73,114,.09)] backdrop-blur">
          <strong className="block text-[13px] text-ink">{title}</strong>
          <span className="mt-0.5 block text-xs leading-5 text-muted">{site.coverageArea || fallback}</span>
        </div>
      </div>
    </div>
  );
}
