import { cn } from "@/lib/utils";

/*
  Laptop- og mobilramme med rene UI-plassholdere. Byttes mot ekte
  skjermbilder av kundeprosjekter når de finnes (legg dem i public/media/).
*/
function ScreenContent({ compact = false }: { compact?: boolean }) {
  return (
    <div className="h-full bg-[linear-gradient(135deg,#f7fbff,#e9f4ff)] p-[8%]">
      <div className={compact ? "h-2 w-3/5 rounded-full bg-[#0d2f58]" : "h-3.5 w-1/2 rounded-md bg-[#0d2f58]"} />
      <div className={compact ? "mt-2 h-1.5 w-4/5 rounded-full bg-[#9cb4ca]" : "mt-3 h-2 w-[72%] rounded bg-[#9cb4ca]"} />
      <div className={compact ? "mt-1.5 h-1.5 w-3/5 rounded-full bg-[#b6c8d8]" : "mt-2 h-2 w-[59%] rounded bg-[#b6c8d8]"} />
      <div className={compact ? "mt-3 h-4 w-1/2 rounded-full bg-brand/80" : "mt-5 h-6 w-28 rounded-full bg-brand/80"} />
      <div className={compact ? "mt-4 grid gap-2" : "mt-6 grid grid-cols-3 gap-2.5"}>
        {Array.from({ length: compact ? 2 : 3 }).map((_, index) => <div key={index} className={compact ? "h-9 rounded-lg border border-line bg-white" : "h-20 rounded-xl border border-line bg-white sm:h-24"} />)}
      </div>
    </div>
  );
}

export function DeviceMockup({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#eef7ff,#c5dcf2)]", className)} role="img" aria-label="Illustrasjon av en nettside vist på laptop og mobil">
      <div className="absolute top-[12%] right-[14%] left-[7%]">
        <div className="rounded-t-[14px] border-[6px] border-b-0 border-[#0f2744] bg-[#0f2744] shadow-[0_25px_55px_rgba(19,55,91,.18)]">
          <div className="flex h-6 items-center gap-1.5 rounded-t-[8px] border-b border-line bg-white px-3">
            <span className="size-1.5 rounded-full bg-[#d2e0ec]" /><span className="size-1.5 rounded-full bg-[#d2e0ec]" /><span className="size-1.5 rounded-full bg-[#d2e0ec]" />
          </div>
          <div className="aspect-[16/10] overflow-hidden"><ScreenContent /></div>
        </div>
        <div className="mx-[-6%] h-3 rounded-b-[12px] bg-[linear-gradient(180deg,#c9d7e4,#9fb3c6)]" />
      </div>
      <div className="absolute right-[6%] bottom-[8%] w-[24%] min-w-[92px] rounded-[18px] border-[5px] border-[#0f2744] bg-[#0f2744] shadow-[0_24px_50px_rgba(19,55,91,.25)]">
        <div className="aspect-[9/18] overflow-hidden rounded-[13px] bg-white"><ScreenContent compact /></div>
      </div>
    </div>
  );
}
