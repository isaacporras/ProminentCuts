"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BookingWizard } from "./BookingWizard";

export function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  // Guard: only render portal after the component has mounted on the client.
  // Avoids calling document.body during SSR or during the React render phase.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/60 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
    >
      <div className="relative flex h-full max-h-[680px] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-bg shadow-2xl">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-text/50 transition hover:bg-primary/10"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
        <BookingWizard onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-primary transition hover:opacity-90"
      >
        Reservar una cita
      </button>

      {mounted && createPortal(isOpen ? modal : null, document.body)}
    </>
  );
}
