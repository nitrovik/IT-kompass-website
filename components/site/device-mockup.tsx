import { Parallax } from "@/components/ui/parallax";
import { cn } from "@/lib/utils";

/*
  Laptop og mobil med en ren forhåndsvisning av en nettside i samme formspråk som
  IT Kompass. Byttes mot ekte skjermbilder av kundeprosjekter når de finnes.
*/
function MiniSite({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative h-full overflow-hidden bg-[linear-gradient(180deg,#f8fbff,#eaf3fd)]">
      <svg className="absolute inset-0 size-full will-change-transform" viewBox="0 0 400 250" preserveAspectRatio="none" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${compact ? 0 : 150} ${250 - i * 10} C ${compact ? 140 : 250} ${200 - i * 14}, ${compact ? 260 : 300} ${120 - i * 8}, 400 ${60 - i * 12}`} fill="none" stroke="#2a8ae0" strokeOpacity={0.18 + i * 0.05} strokeWidth="1.2" />
        ))}
        <path d={`M${compact ? 0 : 150} 230 C ${compact ? 140 : 250} 172, ${compact ? 260 : 300} 104, 400 36`} fill="none" stroke="#2aa6ff" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 40" className="fiber-flow" />
      </svg>
      <div className={cn("relative", compact ? "p-3" : "p-[6%]")}>
        <div className="flex items-center justify-between">
          <span className={cn("rounded-full bg-[#0e2747]", compact ? "h-1.5 w-10" : "h-2 w-16")} />
          {compact ? <span className="h-2 w-3 rounded-sm border border-[#0e2747]/40" /> : <span className="flex gap-2">{[10, 12, 9, 11].map((w, i) => <span key={i} className="h-1.5 rounded-full bg-[#9db3c9]" style={{ width: w * 2 }} />)}<span className="ml-1 h-3 w-10 rounded-full bg-brand" /></span>}
        </div>
        <div className={compact ? "mt-6" : "mt-[9%]"}>
          <span className={cn("block rounded bg-[#0e2747]", compact ? "h-2.5 w-4/5" : "h-4 w-[46%]")} />
          <span className={cn("mt-1.5 block rounded bg-[#0b63c0]", compact ? "h-2.5 w-3/5" : "h-4 w-[34%]")} />
          <span className={cn("block rounded-full bg-[#9db3c9]", compact ? "mt-3 h-1 w-[85%]" : "mt-[3%] h-1.5 w-[40%]")} />
          <span className={cn("block rounded-full bg-[#b9cadb]", compact ? "mt-1 h-1 w-[70%]" : "mt-1.5 h-1.5 w-[33%]")} />
          <span className="mt-[4%] flex gap-1.5"><span className={cn("rounded-full bg-brand", compact ? "h-3 w-14" : "h-5 w-20")} /><span className={cn("rounded-full border border-[#c3d6e9] bg-white", compact ? "h-3 w-10" : "h-5 w-14")} /></span>
        </div>
        <div className={cn("grid", compact ? "mt-6 gap-1.5" : "mt-[8%] grid-cols-4 gap-2")}>
          {Array.from({ length: compact ? 2 : 4 }).map((_, i) => (
            <div key={i} className={cn("rounded-lg border border-[#dce8f4] bg-white/90 shadow-[0_4px_10px_-6px_rgba(14,39,71,.25)]", compact ? "h-9 p-1.5" : "h-16 p-2")}>
              <span className="block size-3 rounded bg-[#e2effc]" />
              <span className="mt-1.5 block h-1 w-3/4 rounded-full bg-[#9db3c9]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DeviceMockup({ className = "" }: { className?: string }) {
  return (
    <div data-observe="toggle" className={cn("relative overflow-hidden rounded-[32px] bg-[radial-gradient(80%_70%_at_60%_30%,#ffffff,#e6f0fb_60%,#d8e7f7)]", className)} role="img" aria-label="Illustrasjon: en nettside vist på laptop og mobil">
      <div className="grid-lines absolute inset-0 opacity-70 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" aria-hidden="true" />
      <div className="absolute top-[11%] right-[13%] left-[6%]" aria-hidden="true">
        <div className="rounded-t-[16px] bg-[linear-gradient(180deg,#1a2b44,#0f1c2f)] p-[1.6%] pb-0 shadow-[0_40px_70px_-30px_rgba(14,39,71,.55)]">
          <div className="relative mx-auto mb-[1%] size-1 rounded-full bg-white/20" />
          <div className="relative aspect-[16/10] overflow-hidden rounded-t-[6px]">
            <MiniSite />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.22),transparent_40%)]" />
          </div>
        </div>
        <div className="relative mx-[-7%] h-3.5 rounded-b-[14px] bg-[linear-gradient(180deg,#e3ebf3,#b7c6d6)] shadow-[0_18px_30px_-14px_rgba(14,39,71,.5)]">
          <span className="absolute top-0 left-1/2 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-[#9fb1c4]" />
        </div>
      </div>
      <Parallax strength={26} className="absolute right-[6%] bottom-[7%] w-[23%] min-w-[96px]">
        <div className="rounded-[22px] bg-[#0f1c2f] p-[5%] shadow-[0_34px_60px_-24px_rgba(14,39,71,.65)] ring-1 ring-white/10" aria-hidden="true">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[17px]">
            <MiniSite compact />
            <span className="absolute top-[2.5%] left-1/2 h-[3%] w-[34%] -translate-x-1/2 rounded-full bg-[#0f1c2f]" />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,.25),transparent_45%)]" />
          </div>
        </div>
      </Parallax>
    </div>
  );
}
