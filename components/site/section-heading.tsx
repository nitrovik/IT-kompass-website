import { SplitLines } from "@/components/ui/split-words";
import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, body, align = "split", id, className, dark = false }: { eyebrow: string; title: string | string[]; body?: string; align?: "left" | "center" | "split"; id?: string; className?: string; dark?: boolean }) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <div className={cn(align === "split" && "grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-16", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      <div>
        <p className="eyebrow" data-reveal="fade">{eyebrow}</p>
        <h2 id={id} data-split className={cn("section-title mt-5", dark ? "text-white" : "text-ink")}><SplitLines lines={lines} /></h2>
      </div>
      {body ? (
        <p data-reveal style={{ ["--d" as string]: ".15s" }} className={cn("lead max-w-[36rem] lg:pb-2", dark && "!text-on-navy", align === "center" && "mx-auto mt-6", align === "left" && "mt-6")}>{body}</p>
      ) : null}
    </div>
  );
}
