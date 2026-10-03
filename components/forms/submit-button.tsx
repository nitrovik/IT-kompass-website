"use client";

import { ArrowRight } from "lucide-react";
import { useFormStatus } from "react-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SubmitButton({ label, className }: { label: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={cn(buttonVariants({ size: "lg" }), className)}>
      {pending ? "Sender …" : <>{label} <ArrowRight size={17} aria-hidden="true" /></>}
    </button>
  );
}
