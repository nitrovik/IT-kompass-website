import { homeProof } from "@/content/home";

const icons = {
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12l2.5 2.5L16 9" /></>,
  panel: <><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5" /></>,
  shield: <><path d="M12 3l8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7z" /><path d="M8.5 12l2.2 2.2 4.8-5" /></>,
};

/* Kort oppsummering rett under heroen. */
export function ProofBar() {
  return (
    <div className="proof-bar">
      <div className="wrap proof-inner">
        <p className="proof-intro">{homeProof.intro}</p>
        {homeProof.items.map((item) => (
          <p key={item.text} className="proof-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{icons[item.icon]}</svg>
            {item.text}
          </p>
        ))}
      </div>
    </div>
  );
}
