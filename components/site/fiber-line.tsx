export function FiberLine({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1000 80" className="h-20 w-full overflow-visible" preserveAspectRatio="none">
        <path d="M0 40 C180 4 250 76 420 40 S700 4 1000 40" fill="none" stroke="rgba(110,197,255,.16)" strokeWidth="1.2" />
        <path d="M0 40 C180 4 250 76 420 40 S700 4 1000 40" fill="none" stroke="rgba(38,155,255,.5)" strokeWidth="1" strokeDasharray="3 18">
          <animate attributeName="stroke-dashoffset" from="0" to="-120" dur="5s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}
