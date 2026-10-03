"use client";

import { motion, useReducedMotion } from "motion/react";

export function WordReveal({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  return (
    <span className="block">
      {lines.map((line, lineIndex) => (
        <span className="block" key={line}>
          {line.split(" ").map((word, wordIndex) => (
            <motion.span
              key={`${lineIndex}-${wordIndex}-${word}`}
              initial={reduce ? false : { y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: .65, ease: [0.22, 1, .36, 1], delay: reduce ? 0 : (lineIndex * .12 + wordIndex * .06) }}
              className="mr-[.22em] inline-block overflow-hidden align-bottom"
            >
              <span className="inline-block">{word}</span>
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}
