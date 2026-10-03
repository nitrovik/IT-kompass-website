import { homeProcess } from "@/content/home";

/* Stegene bindes sammen av en fiberlinje med en lyspuls som vandrer nedover. */
export function ProcessSection() {
  return (
    <section className="section-pad" aria-labelledby="prosess-heading">
      <div className="container-shell">
        <p className="eyebrow">{homeProcess.eyebrow}</p>
        <div className="mt-3 grid items-center gap-12 lg:grid-cols-2 lg:gap-[60px]">
          <div>
            <h2 id="prosess-heading" className="text-[clamp(2.25rem,4vw,3.4rem)] leading-[1.05] font-extrabold tracking-[-.04em] text-ink">
              {homeProcess.title.map((line) => <span key={line} className="block">{line}</span>)}
            </h2>
            <p className="mt-5 max-w-[540px] leading-[1.75] text-muted">{homeProcess.body}</p>
          </div>
          <ol className="relative grid gap-2">
            <span className="absolute top-6 bottom-6 left-6 w-px bg-[linear-gradient(to_bottom,rgba(39,167,255,.1),rgba(39,167,255,.45),rgba(39,167,255,.1))]" aria-hidden="true" />
            {/* Lyspulsen flyttes med transform (ikke top), så animasjonen ikke utløser ny layout. */}
            <span className="absolute top-6 bottom-6 left-[14px] w-5 overflow-hidden" aria-hidden="true">
              <span className="process-pulse absolute inset-0 opacity-0">
                <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(39,167,255,.35),0_0_10px_rgba(39,167,255,.9)]" />
              </span>
            </span>
            {homeProcess.steps.map((step) => (
              <li key={step.number} className="relative grid grid-cols-[48px_1fr] items-start gap-5 py-4">
                <span className="relative z-10 grid size-12 place-items-center rounded-[15px] border border-line bg-white text-sm font-extrabold text-brand shadow-[0_8px_20px_rgba(16,42,77,.06)]">{step.number}</span>
                <div className="pt-1">
                  <h3 className="text-[17px] font-bold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-[1.55] text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
