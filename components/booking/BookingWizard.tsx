"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { BookingState, BookingStep, MonthAvailability } from "@/types/booking";
import type { ProviderItem, ServiceItem } from "@/types/site-config";
import { BOOKING_STEPS } from "@/types/booking";
import { WizardProgressBar } from "./WizardProgressBar";
import { StepSelectProvider } from "./steps/StepSelectProvider";
import { StepSelectService } from "./steps/StepSelectService";
import { StepSelectDate } from "./steps/StepSelectDate";
import { StepSelectTime } from "./steps/StepSelectTime";
import { StepContactForm } from "./steps/StepContactForm";
import { StepConfirmation } from "./steps/StepConfirmation";
import { StepSuccess } from "./steps/StepSuccess";

const INITIAL_STATE: BookingState = {
  provider: null,
  service: null,
  date: null,
  slot: null,
  form: { name: "", email: "", phone: "", comments: "" },
};

interface BookingWizardProps {
  onClose: () => void;
}

export function BookingWizard({ onClose }: BookingWizardProps) {
  const [step, setStep] = useState<BookingStep>("provider");
  const [state, setState] = useState<BookingState>(INITIAL_STATE);
  // monthAvailability cached per provider+service combo so StepSelectTime
  // can read slots from it without a second fetch.
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailability>({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const currentIndex = BOOKING_STEPS.indexOf(step);
  const canGoBack = currentIndex > 0 && step !== "success";

  function goBack() {
    if (canGoBack) setStep(BOOKING_STEPS[currentIndex - 1]);
  }

  function advance() {
    setStep(BOOKING_STEPS[currentIndex + 1]);
  }

  async function handleConfirm() {
    if (!state.provider?.googleCalendarId || !state.service || !state.date || !state.slot) return;
    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarId: state.provider.googleCalendarId,
          serviceName: state.service.name,
          date: state.date,
          startTime: state.slot.start,
          endTime: state.slot.end,
          duration: state.service.durationMinutes,
          provider: { name: state.provider.name },
          client: state.form,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al confirmar la cita");
      setState((s) => ({ ...s, eventId: data.eventId }));
      advance();
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setBookingLoading(false);
    }
  }

  function isContactValid() {
    const { name, email, phone } = state.form;
    return name.trim() && email.includes("@") && phone.trim();
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-primary/10 px-4 py-3">
        {canGoBack && (
          <button onClick={goBack} className="rounded-full p-1 transition hover:bg-primary/10">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </button>
        )}
        <div className="flex-1">
          <WizardProgressBar currentStep={step} />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {step === "provider" && (
          <StepSelectProvider
            selected={state.provider}
            onSelect={(p: ProviderItem) => { setState((s) => ({ ...s, provider: p, date: null, slot: null })); advance(); }}
          />
        )}
        {step === "service" && (
          <StepSelectService
            selected={state.service}
            onSelect={(sv: ServiceItem) => { setState((s) => ({ ...s, service: sv, date: null, slot: null })); advance(); }}
          />
        )}
        {step === "date" && state.provider && state.service && (
          <StepSelectDate
            provider={state.provider}
            service={state.service}
            selected={state.date}
            onSelect={(date: string) => {
              setState((s) => ({ ...s, date, slot: null }));
              advance();
            }}
            onAvailabilityLoaded={setMonthAvailability}
          />
        )}
        {step === "time" && state.date && (
          <StepSelectTime
            date={state.date}
            availability={monthAvailability}
            selected={state.slot}
            onSelect={(slot) => { setState((s) => ({ ...s, slot })); advance(); }}
          />
        )}
        {step === "contact" && (
          <StepContactForm
            data={state.form}
            onChange={(form) => setState((s) => ({ ...s, form }))}
          />
        )}
        {step === "confirm" && (
          <StepConfirmation
            state={state}
            onConfirm={handleConfirm}
            loading={bookingLoading}
            error={bookingError}
          />
        )}
        {step === "success" && (
          <StepSuccess state={state} onClose={onClose} />
        )}
      </div>

      {/* Next button (only for steps that don't auto-advance on click) */}
      {(step === "contact") && (
        <div className="border-t border-primary/10 px-4 py-3">
          <button
            onClick={advance}
            disabled={!isContactValid()}
            className="w-full rounded-full bg-secondary py-3 text-sm font-bold text-primary transition hover:opacity-90 disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
