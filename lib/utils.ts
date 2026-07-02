import { clsx, type ClassValue } from "clsx";
import type { AppointmentsInfo } from "@/types/site-config";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function buildWhatsAppLink(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildAppointmentCtaHref(appointments: AppointmentsInfo) {
  switch (appointments.ctaType) {
    case "whatsapp":
      return buildWhatsAppLink(
        appointments.ctaValue,
        "Hola, me gustaría reservar una cita."
      );
    case "phone":
      return `tel:${appointments.ctaValue}`;
    case "email":
      return `mailto:${appointments.ctaValue}`;
  }
}
