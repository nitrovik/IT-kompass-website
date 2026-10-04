import type { ReactNode } from "react";
import type { ServiceIconKey } from "@/content/types";

/*
  Egne ikoner for de fire tjenesteområdene, tegnet i samme strek og formspråk som
  kompasset og fibrene. Når kortet kommer til syne, tegnes strekene opp (.draw) og
  en liten lysimpuls (.spark) løper én gang langs hovedlinjen.
*/
function Icon({ children, className = "", size = 26 }: { children: ReactNode; className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`service-icon ${className}`} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const spark = { className: "spark", stroke: "#2aa6ff", strokeWidth: 2.4, pathLength: 1 } as const;

export function WifiIcon({ className, size }: { className?: string; size?: number }) {
  const outer = "M4.5 13.2a16.3 16.3 0 0 1 23 0";
  return (
    <Icon className={className} size={size}>
      <path className="draw" pathLength={1} d={outer} />
      <path className="draw" pathLength={1} d="M8.6 17.3a10.4 10.4 0 0 1 14.8 0" />
      <path className="draw" pathLength={1} d="M12.7 21.3a4.6 4.6 0 0 1 6.6 0" />
      <circle cx="16" cy="25" r="1.4" fill="currentColor" stroke="none" />
      <path {...spark} d={outer} />
    </Icon>
  );
}

export function FiberIcon({ className, size }: { className?: string; size?: number }) {
  const cable = "M4 22c5.5 0 6-12 12-12s6.5 12 12 12";
  return (
    <Icon className={className} size={size}>
      <path className="draw" pathLength={1} d={cable} />
      <path className="draw" pathLength={1} d="M4 26.5c5.5 0 6.5-8 12-8s6.5 8 12 8" strokeOpacity=".45" />
      <circle cx="16" cy="10" r="2.1" fill="#fff" />
      <path {...spark} d={cable} />
    </Icon>
  );
}

export function SupportIcon({ className, size }: { className?: string; size?: number }) {
  const pulse = "M7 17h4l2-4.5 3 9 2.5-6.5 1.5 2H25";
  return (
    <Icon className={className} size={size}>
      <rect className="draw" pathLength={1} x="3.5" y="6" width="25" height="17" rx="3" />
      <path className="draw" pathLength={1} d="M12 27h8M16 23v4" />
      <path className="draw" pathLength={1} d={pulse} />
      <path {...spark} d={pulse} />
    </Icon>
  );
}

export function WebIcon({ className, size }: { className?: string; size?: number }) {
  const bar = "M3.5 11.5h25";
  return (
    <Icon className={className} size={size}>
      <rect className="draw" pathLength={1} x="3.5" y="5.5" width="25" height="21" rx="3" />
      <path className="draw" pathLength={1} d={bar} />
      <path className="draw" pathLength={1} d="M8 16.5h9M8 20.5h6" />
      <rect className="draw" pathLength={1} x="20" y="15.5" width="4.5" height="6" rx="1" />
      <circle cx="7" cy="8.5" r=".6" fill="currentColor" stroke="none" />
      <circle cx="9.4" cy="8.5" r=".6" fill="currentColor" stroke="none" />
      <path {...spark} d={bar} />
    </Icon>
  );
}

export const serviceIcons: Record<ServiceIconKey, (props: { className?: string; size?: number }) => React.JSX.Element> = {
  wifi: WifiIcon,
  "fiber-og-telecom": FiberIcon,
  "it-support": SupportIcon,
  nettsider: WebIcon,
};
