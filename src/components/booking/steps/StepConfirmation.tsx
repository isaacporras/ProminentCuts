"use client";

import { MessageCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { buildWhatsAppLink } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import type { BookingState } from "@/types/booking";

interface StepConfirmationProps {
  state: BookingState;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
}

interface RowProps { label: string; value: string }
function Row({ label, value }: RowProps) {
  return (
    <div className="flex justify-between border-b border-primary/10 py-2.5 text-sm">
      <span className="text-text/60">{label}</span>
      <span className="font-medium text-primary text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export function StepConfirmation({ state, onConfirm, loading, error }: StepConfirmationProps) {
  const { provider, service, date, slot, form } = state;
  if (!provider || !service || !date || !slot) return null;

  const formattedDate = format(parseISO(date), "EEEE d 'de' MMMM yyyy", { locale: es });

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-primary">Confirmar cita</h2>
      <p className="mb-6 text-sm text-text/60">Revisá los detalles antes de confirmar.</p>

      <div className="rounded-xl border border-primary/10 bg-bg px-4">
        <Row label={siteConfig.terminology.providerSingular} value={provider.name} />
        <Row label="Servicio" value={`${service.name}${service.price ? ` — ${service.price}` : ""}`} />
        <Row label="Fecha" value={formattedDate} />
        <Row label="Hora" value={`${slot.start} – ${slot.end}`} />
        <Row label="Cliente" value={form.name} />
        <Row label="Email" value={form.email} />
        <Row label="Teléfono" value={form.phone} />
        {form.comments && <Row label="Comentarios" value={form.comments} />}
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <p className="mt-1 text-xs text-red-500">
            Podés intentarlo de nuevo o contactarnos directamente.
          </p>
          <a
            href={buildWhatsAppLink(
              siteConfig.appointments.ctaValue,
              `Hola, quiero reservar una cita de ${service.name} con ${provider.name} el ${formattedDate} a las ${slot.start}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Reservar por WhatsApp
          </a>
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={loading}
        className="mt-6 w-full rounded-full bg-secondary py-3 text-sm font-bold text-primary transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Confirmando…" : "Confirmar cita"}
      </button>
    </div>
  );
}
