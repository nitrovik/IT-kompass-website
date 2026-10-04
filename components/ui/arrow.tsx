/* Pil som glir mot høyre når forelderen (.group) får hover eller fokus. */
export function Arrow({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg className={`btn-arrow shrink-0 ${className}`} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
