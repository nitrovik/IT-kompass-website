"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* Hoved-CTA som trekkes svakt mot musepekeren. Ingen effekt på berøringsskjerm eller ved redusert bevegelse. */
export function MagneticLink({ href, children, variant = "default", size = "lg", className }: { href: string; children: ReactNode; variant?: "default" | "secondary" | "outline"; size?: "lg" | "default"; className?: string }) {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      className="inline-flex"
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.25 }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({ x: ((event.clientX - rect.left) / rect.width - 0.5) * 6, y: ((event.clientY - rect.top) / rect.height - 0.5) * 6 });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>{children}</Link>
    </motion.div>
  );
}
