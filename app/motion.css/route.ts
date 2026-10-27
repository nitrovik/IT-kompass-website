import { MOTION_CSS } from "@/components/home/motion-css";

/* Keyframes for bevegelsen på forsiden, bygget som en statisk fil (se components/home/motion-css.ts) */
export const dynamic = "force-static";

export function GET() {
  return new Response(MOTION_CSS, {
    headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
