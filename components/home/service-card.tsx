import { ArrowRight, Check } from "lucide-react";
import type { HomeService } from "@/content/home";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";

export function ServiceCard({ service, index, headingLevel = "h3" }: { service: HomeService; index: number; headingLevel?: "h2" | "h3" }) {
  const Icon = service.icon;
  const Heading = headingLevel;
  return (
    <Reveal delay={index * 0.06} className="h-full">
      <SpotlightCard href={service.href} className="group p-6 sm:p-7">
        <div className="flex h-full min-h-[230px] flex-col">
          <span className="icon-draw grid size-12 place-items-center rounded-[15px] bg-tile text-brand" aria-hidden="true">
            <Icon size={22} strokeWidth={1.9} />
          </span>
          <Heading className="mt-7 text-[19px] font-bold tracking-[-.01em] text-ink">{service.title}</Heading>
          <p className="mt-2.5 text-sm leading-6 text-muted">{service.description}</p>
          {service.bullets?.length ? (
            <ul className="mt-5 grid gap-2 text-sm text-body">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />{bullet}</li>
              ))}
            </ul>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-extrabold text-brand">
            Les mer <span className="sr-only">om {service.title}</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}
