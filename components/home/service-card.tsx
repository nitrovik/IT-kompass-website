import type { HomeService } from "@/content/home";
import { ServiceCardShell } from "@/components/home/service-card-shell";

// Ikonet rendres på serveren, fordi komponentfunksjoner ikke kan sendes til klientkomponenter.
export function ServiceCard({ service, index }: { service: HomeService; index: number }) {
  const { icon: Icon, ...rest } = service;
  return <ServiceCardShell service={rest} icon={<Icon size={21} />} index={index} />;
}
