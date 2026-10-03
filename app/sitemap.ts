import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const routes = ["/", "/tjenester", "/prosjekter", "/om-oss", "/support", "/kontakt", "/personvern", "/finn-riktig-losning"];
  return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "/" ? "weekly" as const : "monthly" as const, priority: route === "/" ? 1 : .7 })), ...services.map((service) => ({ url: `${base}/tjenester/${service.slug}`, changeFrequency: "monthly" as const, priority: .8 }))];
}
