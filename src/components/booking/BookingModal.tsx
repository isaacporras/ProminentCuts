"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BookingWizard } from "./BookingWizard";

export function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Portal element is created in the lazy initializer (client-only).
  // Avoids calling setState inside an effect.
  const [portalEl] = useState<HTMLDivElement | null>(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    document.body.appendChild(el);
    return el;
  });

  // Cleanup only on unmount — does not call setState
  useEffect(() => {
    return () => { if (portalEl) document.body.removeChild(portalEl); };
  }, [portalEl]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const modal = isOpen ? (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
    >
      <div className="relative flex h-full max-h-[680px] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-bg shadow-2xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-text/50 transition hover:bg-primary/10"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        <BookingWizard onClose={() => setIsOpen(false)} />
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-primary transition hover:opacity-90"
      >
        Reservar una cita
      </button>

      {portalEl && createPortal(modal, portalEl)}
    </>
  );
}
