import { homeProcess } from "@/content/home";
import { FiberLine } from "@/components/site/fiber-line";
import { ScrollSequence } from "@/components/site/scroll-sequence";

export function ProcessSection() {
  return (
    <div className="relative mt-14 grid gap-4 md:grid-cols-4">
      <FiberLine className="hidden md:block" />
      <ScrollSequence />
      {homeProcess.map((item, index) => (
        <article key={item.number} className="relative z-10 rounded-[1.4rem] border border-white/10 bg-[#0a1828]/95 p-6">
          <div className="text-xs font-bold tracking-[.18em] text-[#6EC5FF]">{item.number}</div>
          <h3 className="mt-12 text-xl font-semibold tracking-[-.03em]">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
          {index < 3 ? <div className="mt-6 h-px w-12 bg-gradient-to-r from-[#269BFF] to-transparent" /> : null}
        </article>
      ))}
    </div>
  );
}
