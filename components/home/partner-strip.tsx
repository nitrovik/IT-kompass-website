export function PartnerStrip() {
  const items = Array.from({ length: 8 }).map(() => "Bekreftet partnerlogo settes inn");
  return (
    <div className="overflow-hidden border-y border-white/8 bg-white/[.02]">
      <div className="flex min-w-max animate-[marquee_30s_linear_infinite] gap-12 py-6 text-sm font-semibold text-slate-500 [@media(prefers-reduced-motion:reduce)]:animate-none">
        {[...items, ...items].map((label, index) => <span key={`${label}-${index}`} className="flex items-center gap-3"><span className="size-1.5 rounded-full bg-[#269BFF]/50" />{label}</span>)}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}` }} />
    </div>
  );
}
