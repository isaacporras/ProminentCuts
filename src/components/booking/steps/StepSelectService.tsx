"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types/site-config";

interface StepSelectServiceProps {
  services: ServiceItem[];
  selected: ServiceItem | null;
  onSelect: (service: ServiceItem) => void;
}

export function StepSelectService({ services, selected, onSelect }: StepSelectServiceProps) {
  const bookableServices = services.filter((s) => s.durationMinutes);

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-primary">Elige el servicio</h2>
      <p className="mb-6 text-sm text-text/60">¿Qué servicio te gustaría hoy?</p>
      <div className="flex flex-col gap-3">
        {bookableServices.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={cn(
              "flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition hover:border-secondary",
              selected?.id === service.id
                ? "border-secondary bg-secondary/5"
                : "border-primary/10 bg-bg"
            )}
          >
            <div>
              <p className="font-semibold text-primary">{service.name}</p>
              <p className="text-sm text-text/60">{service.description}</p>
            </div>
            <div className="ml-4 shrink-0 text-right">
              {service.price && (
                <p className="font-bold text-secondary">{service.price}</p>
              )}
              {service.durationMinutes && (
                <p className="flex items-center gap-1 text-xs text-text/50">
                  <Clock className="h-3 w-3" />
                  {service.durationMinutes} min
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
