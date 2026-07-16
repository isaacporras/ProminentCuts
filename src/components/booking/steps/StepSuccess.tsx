"use client";

import { CheckCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { siteConfig } from "@/config/site.config";
import { formatTimeLabel, type TimeFormat } from "@/lib/schedule";
import type { BookingState } from "@/types/booking";

interface StepSuccessProps {
  state: BookingState;
  onClose: () => void;
  timeFormat: TimeFormat;
}

export function StepSuccess({ state, onClose, timeFormat }: StepSuccessProps) {
  const { provider, service, date, slot, form } = state;
  if (!provider || !service || !date || !slot) return null;

  const formattedDate = format(parseISO(date), "EEEE d 'de' MMMM yyyy", { locale: es });

  return (
    <div className="flex flex-col items-center text-center">
      <CheckCircle className="mb-4 h-14 w-14 text-[#4ade80]" />
      <h2 className="mb-2 text-2xl font-bold text-primary">¡Cita confirmada!</h2>
      <p className="mb-6 text-text/60">
        Te enviamos un resumen a <strong>{form.email}</strong>.
      </p>

      <div className="mb-8 w-full max-w-sm rounded-xl border border-primary/10 bg-bg px-4 py-2 text-left text-sm">
        <div className="border-b border-primary/10 py-2.5">
          <span className="text-text/50">{siteConfig.terminology.providerSingular}</span>
          <p className="font-semibold">{provider.name}</p>
        </div>
        <div className="border-b border-primary/10 py-2.5">
          <span className="text-text/50">Servicio</span>
          <p className="font-semibold">{service.name}</p>
        </div>
        <div className="py-2.5">
          <span className="text-text/50">Fecha y hora</span>
          <p className="font-semibold capitalize">{formattedDate}</p>
          <p className="text-secondary font-bold">
            {formatTimeLabel(slot.start, timeFormat)} – {formatTimeLabel(slot.end, timeFormat)}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-bg transition hover:opacity-80"
      >
        Cerrar
      </button>
    </div>
  );
}
