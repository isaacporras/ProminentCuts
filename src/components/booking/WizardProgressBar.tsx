"use client";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import { BOOKING_STEPS, type BookingStep } from "@/types/booking";

const STEP_LABELS: Record<BookingStep, string> = {
  provider: siteConfig.terminology.providerSingular,
  service: "Servicio",
  date: "Fecha",
  time: "Hora",
  contact: "Datos",
  confirm: "Confirmar",
  success: "Listo",
};

interface WizardProgressBarProps {
  currentStep: BookingStep;
}

export function WizardProgressBar({ currentStep }: WizardProgressBarProps) {
  const currentIndex = BOOKING_STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center justify-between gap-1 px-2">
      {BOOKING_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <div key={step} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                isDone && "bg-secondary text-primary",
                isActive && "bg-primary text-bg ring-2 ring-secondary ring-offset-1",
                !isDone && !isActive && "bg-primary/10 text-text/40"
              )}
            >
              {isDone ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-center text-[10px] leading-tight sm:block",
                isActive ? "font-semibold text-primary" : "text-text/40"
              )}
            >
              {STEP_LABELS[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
