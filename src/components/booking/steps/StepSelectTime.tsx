"use client";

import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { siteConfig } from "@/config/site.config";
import { formatTimeLabel, type TimeFormat } from "@/lib/schedule";
import type { MonthAvailability, TimeSlot } from "@/types/booking";

interface StepSelectTimeProps {
  date: string;
  availability: MonthAvailability;
  selected: TimeSlot | null;
  timeFormat: TimeFormat;
  onSelect: (slot: TimeSlot) => void;
}

export function StepSelectTime({ date, availability, selected, timeFormat, onSelect }: StepSelectTimeProps) {
  const slots = availability[date]?.slots ?? [];
  const formattedDate = format(parseISO(date), "EEEE d 'de' MMMM", { locale: es });
  const hasInProgress = slots.some((s) => s.inProgress);

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-primary">Elige la hora</h2>
      <p className="mb-6 capitalize text-sm text-text/60">{formattedDate}</p>

      {slots.length === 0 ? (
        <p className="text-sm text-text/50">No hay horarios disponibles para este día.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => {
            const isSelected = selected?.start === slot.start && slot.available;
            return (
              <button
                key={slot.start}
                onClick={() => slot.available && onSelect(slot)}
                disabled={!slot.available}
                title={slot.inProgress ? "Este horario ya inició — llamá para verificar disponibilidad" : !slot.available ? "No disponible" : undefined}
                className={cn(
                  "rounded-lg border-2 py-2 text-sm font-medium transition",
                  isSelected && "border-secondary bg-secondary/5 font-bold text-primary",
                  !isSelected && slot.available && "border-primary/10 bg-bg text-text/80 hover:border-secondary",
                  !slot.available && !slot.inProgress && "cursor-not-allowed border-primary/5 bg-primary/5 text-text/25 line-through",
                  slot.inProgress && "cursor-not-allowed border-amber-300 bg-amber-50 text-amber-600"
                )}
              >
                {formatTimeLabel(slot.start, timeFormat)}
              </button>
            );
          })}
        </div>
      )}

      {hasInProgress && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
          <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-700">
            El horario marcado en naranja ya inició. Llamanos al{" "}
            <a href={`tel:${siteConfig.contact.phone}`} className="font-semibold underline">
              {siteConfig.contact.phone}
            </a>{" "}
            para verificar si aún hay disponibilidad.
          </p>
        </div>
      )}

      <p className="mt-3 text-[11px] text-text/40">
        Tachado = ocupado · Naranja = en curso · Solo podés seleccionar horarios disponibles
      </p>
    </div>
  );
}
