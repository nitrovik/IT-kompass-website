"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function RouteTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return <motion.div initial={reduce ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28, ease: "easeOut" }}>{children}</motion.div>;
}
