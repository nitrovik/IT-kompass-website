import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { SERVICES_ENABLED, services, serviceHref } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    ...(SERVICES_ENABLED
      ? [
          { path: "/tjenester", priority: 0.9, changeFrequency: "monthly" as const },
          ...services.map((service) => ({ path: serviceHref(service.slug), priority: 0.8, changeFrequency: "monthly" as const })),
        ]
      : []),
    { path: "/personvern", priority: 0.3, changeFrequency: "yearly" as const },
  ];
  return routes.map((route) => ({ url: `${base}${route.path}`, changeFrequency: route.changeFrequency, priority: route.priority }));
}
