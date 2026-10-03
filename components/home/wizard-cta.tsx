import { ArrowRight } from "lucide-react";
import { homeWizardCta } from "@/content/home";
import { FiberField } from "@/components/site/fiber-field";
import { MagneticLink } from "@/components/ui/magnetic-link";

export function WizardCta() {
  return (
    <section className="bg-[linear-gradient(135deg,#071b35,#0d2b50)] py-16 sm:py-20 text-white" aria-labelledby="veiviser-heading">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(115deg,#0b2748,#0a3b66)] p-7 sm:p-10">
          <FiberField variant="banner" className="opacity-60" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow !text-[#8ccfff]">{homeWizardCta.eyebrow}</p>
              <h2 id="veiviser-heading" className="mt-2 text-3xl font-extrabold tracking-[-.03em] sm:text-4xl">{homeWizardCta.title}</h2>
              <p className="mt-2 text-on-navy">{homeWizardCta.body}</p>
              <ol className="mt-6 flex flex-wrap gap-2.5" aria-label="Slik fungerer veiviseren">
                {homeWizardCta.steps.map((step, index) => (
                  <li key={step} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] py-1.5 pr-3.5 pl-1.5 text-xs font-semibold text-[#dbe8f5]">
                    <span className="grid size-6 place-items-center rounded-full bg-white/12 text-[11px] font-extrabold text-[#8ccfff]">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <MagneticLink href={homeWizardCta.cta.href}>{homeWizardCta.cta.label} <ArrowRight size={17} aria-hidden="true" /></MagneticLink>
          </div>
        </div>
      </div>
    </section>
  );
}
