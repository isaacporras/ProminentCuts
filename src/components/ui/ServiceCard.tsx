import type { ServiceItem } from "@/types/site-config";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <div className="rounded-xl border border-primary/10 bg-bg p-6 shadow-sm transition hover:shadow-md">
      <h3 className="font-heading text-lg font-semibold text-primary">{service.name}</h3>
      <p className="mt-2 text-sm text-text/70">{service.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm font-medium text-secondary">
        {service.price && <span>{service.price}</span>}
        {service.durationMinutes && <span>{service.durationMinutes} min</span>}
      </div>
    </div>
  );
}
