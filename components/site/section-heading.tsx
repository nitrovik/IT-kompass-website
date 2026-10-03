import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, body, align = "split", id, className }: { eyebrow: string; title: string; body?: string; align?: "left" | "center" | "split"; id?: string; className?: string }) {
  return (
    <div className={cn(align === "split" && "flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      <div className={cn(align === "split" && "max-w-2xl")}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="section-title mt-3 text-ink">{title}</h2>
      </div>
      {body ? <p className={cn("leading-[1.65] text-muted", align === "split" ? "max-w-[38rem] md:pb-1.5" : "mt-5 max-w-2xl", align === "center" && "mx-auto")}>{body}</p> : null}
    </div>
  );
}
