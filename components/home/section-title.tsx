import { Fragment } from "react";
import type { TitleLine } from "@/content/home";

/* Overskriftslinjer fra content/home.ts: vanlig tekst og et kursivt aksentord, linjeskift mellom linjene. */
export function TitleLines({ lines }: { lines: readonly TitleLine[] }) {
  return lines.map((line, i) => (
    <Fragment key={`${line.text ?? ""}${line.em ?? ""}`}>
      {i > 0 ? <br /> : null}
      {line.text}
      {line.em ? <em>{line.em}</em> : null}
    </Fragment>
  ));
}
