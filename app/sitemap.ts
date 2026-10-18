import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const routes = ["/", "/personvern"];
  return routes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "/" ? "weekly" as const : "monthly" as const, priority: route === "/" ? 1 : .7 }));
}
