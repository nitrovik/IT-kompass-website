import type { ReactNode } from "react";

export function FormShell({ title, children }: { title: string; children: ReactNode }) {
  return <div className="rounded-[1.6rem] border border-white/10 bg-[#0a1828] p-6 sm:p-8"><h2 className="text-2xl font-semibold tracking-[-.04em]">{title}</h2><div className="mt-7">{children}</div></div>;
}
