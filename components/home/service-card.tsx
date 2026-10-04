import Link from "next/link";
import { serviceIcons } from "@/components/icons/service-icons";
import type { ServiceCardData } from "@/content/types";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Arrow } from "@/components/ui/arrow";

export function ServiceCard({ service, index, headingLevel = "h3", large = false }: { service: ServiceCardData; index: number; headingLevel?: "h2" | "h3"; large?: boolean }) {
  const Icon = serviceIcons[service.icon];
  const Heading = headingLevel;
  return (
    <div data-reveal className="h-full" style={{ ["--d" as string]: `${index * 0.08}s` }}>
      {/* Hele kortet er klikkbart via lenken i overskriften (strukket over kortet), så overskriften beholdes for skjermlesere. */}
      <SpotlightCard className="group h-full p-7 sm:p-8">
        <div className={`flex h-full flex-col ${large ? "min-h-[330px]" : "min-h-[290px]"}`}>
          <div className="flex items-start justify-between">
            <span aria-hidden="true" className="card-icon relative grid size-14 place-items-center rounded-[18px] bg-[linear-gradient(160deg,#f5faff,#e2effc)] text-brand shadow-[inset_0_0_0_1px_#d5e6f7,0_8px_18px_-10px_rgba(10,110,209,.45)]">
              <span className="card-icon-glow absolute inset-0 rounded-[18px] bg-[radial-gradient(circle_at_50%_35%,rgba(42,166,255,.32),transparent_68%)]" />
              <Icon className="relative" />
            </span>
            <span aria-hidden="true" className="tabular pt-1 text-xs font-semibold tracking-[.16em] text-faint">0{index + 1}</span>
          </div>
          <Heading className="card-title mt-9 text-[21px] text-ink">
            <Link href={service.href} className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-[24px] after:content-['']">{service.title}</Link>
          </Heading>
          <p className="mt-3 text-[15px] leading-[1.6] text-muted">{service.description}</p>
          {service.bullets?.length ? (
            <ul className="mt-6 grid gap-2.5 text-[14px] text-body">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-[9px] h-px w-3 shrink-0 bg-brand" />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-auto pt-9" aria-hidden="true">
            <div className="card-fiber relative h-px overflow-hidden bg-[linear-gradient(90deg,#dce8f4,#bdd5ee,#dce8f4)]">
              <span className="card-fiber-pulse absolute -inset-y-px left-0 w-1/3 bg-[linear-gradient(90deg,transparent,#2aa6ff,transparent)] opacity-0" />
            </div>
            <span className="mt-5 flex items-center justify-between text-[14px] font-semibold text-ink">
              Les mer
              <span className="grid size-10 place-items-center rounded-full border border-line-strong text-ink transition-[background-color,border-color,color] duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                <Arrow size={15} />
              </span>
            </span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
