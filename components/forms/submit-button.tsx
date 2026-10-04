"use client";

import { useFormStatus } from "react-dom";
import { buttonVariants } from "@/components/ui/button";
import { Arrow } from "@/components/ui/arrow";
import { cn } from "@/lib/utils";

export function SubmitButton({ label, className }: { label: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={cn(buttonVariants({ size: "lg" }), className)}>
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          Sender …
        </>
      ) : (
        <>{label} <Arrow /></>
      )}
    </button>
  );
}
