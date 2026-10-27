import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";
import { getService, serviceHref, services } from "@/content/services";
import { ServicePage } from "@/components/service/service-page";

// Bare tjenestene som finnes, bygges som faste sider. Andre adresser gir 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  return service ? pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: serviceHref(service.slug) }) : {};
}

export default async function ServiceRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
