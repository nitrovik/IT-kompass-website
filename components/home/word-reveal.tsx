/*
  Ordvis avdekking med ren CSS. Teksten finnes i HTML-en fra start, så den er
  synlig selv om JavaScript ikke har lastet, og den teller med i LCP med en gang.
*/
export function WordReveal({ lines, accentLast = false }: { lines: string[]; accentLast?: boolean }) {
  return (
    <>
      {lines.map((line, lineIndex) => (
        <span className={accentLast && lineIndex === lines.length - 1 ? "block text-[#176bb5]" : "block"} key={line}>
          {line.split(" ").map((word, wordIndex) => (
            <span key={`${lineIndex}-${wordIndex}`} className="word-reveal mr-[.22em] last:mr-0" style={{ animationDelay: `${lineIndex * 0.12 + wordIndex * 0.06}s` }}>
              {word}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}
