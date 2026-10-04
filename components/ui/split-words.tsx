import { Fragment } from "react";

/*
  Deler en overskrift i ord som glir opp ett for ett når forelderen får data-inview
  (se RevealObserver og .split-word i globals.css). Teksten er vanlig tekst i HTML-en,
  så skjermlesere og søkemotorer leser den som normalt.
*/
export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((word, i, words) => (
        <Fragment key={`${word}-${i}`}>
          <span className="split-word">
            <span style={{ ["--i" as string]: start + i }}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function SplitLines({ lines }: { lines: string[] }) {
  // Ordnummeret fortsetter over linjene, så ordene kommer i jevn rekkefølge
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((sum, line) => sum + line.split(" ").length, 0));
  return (
    <>
      {lines.map((line, i) => <span key={line} className="block"><SplitWords text={line} start={starts[i]} /></span>)}
    </>
  );
}
