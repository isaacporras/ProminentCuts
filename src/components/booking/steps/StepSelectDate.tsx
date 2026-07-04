"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn, buildWhatsAppLink } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import type { MonthAvailability } from "@/types/booking";
import type { ProviderItem, ServiceItem } from "@/types/site-config";

interface StepSelectDateProps {
  provider: ProviderItem;
  service: ServiceItem;
  selected: string | null;
  onSelect: (date: string) => void;
  onAvailabilityLoaded?: (avail: MonthAvailability) => void;
}

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export function StepSelectDate({ provider, service, selected, onSelect, onAvailabilityLoaded }: StepSelectDateProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [availability, setAvailability] = useState<MonthAvailability>({});
  const [loading, setLoading] = useState(false);
  const [calendarError, setCalendarError] = useState(false);

  useEffect(() => {
    if (!provider.googleCalendarId || !service.durationMinutes) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setCalendarError(false);
      try {
        const r = await fetch(
          `/api/availability?calendarId=${encodeURIComponent(provider.googleCalendarId!)}&year=${viewDate.getFullYear()}&month=${viewDate.getMonth() + 1}&duration=${service.durationMinutes}`
        );
        const data = await r.json();
        if (cancelled) return;
        if (data.error || !r.ok) {
          setCalendarError(true);
        } else {
          setAvailability(data);
          onAvailabilityLoaded?.(data);
        }
      } catch {
        if (!cancelled) setCalendarError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [provider.googleCalendarId, service.durationMinutes, viewDate, onAvailabilityLoaded]);

  const whatsappHref = buildWhatsAppLink(
    siteConfig.appointments.ctaValue,
    `Hola, quiero reservar una cita de ${service.name} con ${provider.name}.`
  );

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = (getDay(monthStart) + 6) % 7;
  const today = startOfDay(new Date());

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-primary">Elige el día</h2>
      <p className="mb-4 text-sm text-text/60">
        Verde = hay disponibilidad. Gris = cerrado o completo.
      </p>

      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          disabled={isBefore(startOfMonth(subMonths(viewDate, 1)), startOfMonth(today))}
          aria-label="Previous month"
          className="rounded-full p-1 transition hover:bg-primary/10 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <p className="font-semibold capitalize text-primary">
          {format(viewDate, "MMMM yyyy", { locale: es })}
        </p>
        <button
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          aria-label="Next month"
          className="rounded-full p-1 transition hover:bg-primary/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Error: calendar not accessible */}
      {calendarError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-center">
          <p className="text-sm font-medium text-red-700">
            No pudimos cargar la disponibilidad de {provider.name}.
          </p>
          <p className="mt-1 text-xs text-red-500">
            Por favor contáctanos directamente para coordinar tu cita.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Reservar por WhatsApp
          </a>
        </div>
      )}

      {/* Calendar grid */}
      {!calendarError && (
        <>
          <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-text/50">
            {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center text-sm text-text/50">
              Cargando disponibilidad…
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const avail = availability[dateStr];
                const isPast = isBefore(day, today);
                const isClosed = !avail || avail.total === 0;
                const isFull = avail ? avail.free === 0 : false;
                const isDisabled = isPast || isClosed || isFull;
                const isSelected = selected === dateStr && !isDisabled;

                return (
                  <button
                    key={dateStr}
                    disabled={isDisabled}
                    onClick={() => onSelect(dateStr)}
                    className={cn(
                      "flex flex-col items-center rounded-lg pb-1 pt-1.5 text-xs transition",
                      isSelected && "bg-secondary text-primary font-bold",
                      !isSelected && !isDisabled && "hover:bg-secondary/10",
                      isDisabled && "cursor-default opacity-40"
                    )}
                  >
                    <span>{format(day, "d")}</span>
                    {/* Segmented bar: each slot is a segment, green = free, dark = busy */}
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-primary/10">
                      {!isPast && avail && avail.slots.length > 0 && (
                        <div className="flex h-full">
                          {avail.slots.map((slot, i) => (
                            <div
                              key={i}
                              className="h-full flex-1"
                              style={{
                                backgroundColor: slot.available
                                  ? "#4ade80"
                                  : "rgba(26,26,26,0.45)",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-3 flex gap-4 text-[11px] text-text/50">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-[#4ade80]" />Libre</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-primary/45" />Ocupado</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-3 rounded-sm bg-primary/10" />Cerrado</span>
          </div>
        </>
      )}
    </div>
  );
}
