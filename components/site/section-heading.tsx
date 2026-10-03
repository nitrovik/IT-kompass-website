import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, body, align = "left" }: { eyebrow: string; title: string; body?: string; align?: "left" | "center" }) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center")}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="section-title mt-5 max-w-4xl">{title}</h2>
      {body ? <p className="body-lg mt-5 max-w-2xl">{body}</p> : null}
    </div>
  );
}
