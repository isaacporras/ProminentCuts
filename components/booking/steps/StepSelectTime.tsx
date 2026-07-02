"use client";

import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { MonthAvailability, TimeSlot } from "@/types/booking";

interface StepSelectTimeProps {
  date: string;
  availability: MonthAvailability;
  selected: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

export function StepSelectTime({ date, availability, selected, onSelect }: StepSelectTimeProps) {
  const slots = availability[date]?.slots ?? [];
  const formattedDate = format(parseISO(date), "EEEE d 'de' MMMM", { locale: es });

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
                title={!slot.available ? "No disponible" : undefined}
                className={cn(
                  "rounded-lg border-2 py-2 text-sm font-medium transition",
                  isSelected
                    ? "border-secondary bg-secondary/5 font-bold text-primary"
                    : slot.available
                    ? "border-primary/10 bg-bg text-text/80 hover:border-secondary"
                    : "cursor-not-allowed border-primary/5 bg-primary/5 text-text/25 line-through"
                )}
              >
                {slot.start}
              </button>
            );
          })}
        </div>
      )}
      <p className="mt-4 text-[11px] text-text/40">
        Tachado = ocupado · Solo podés seleccionar horarios disponibles
      </p>
    </div>
  );
}
