import type { ProviderItem, ServiceItem } from "@/types/site-config";

export interface TimeSlot {
  start: string;     // "10:00"
  end: string;       // "10:30"
  available: boolean;
  /** True when the slot has started but not yet ended — user should call to check. */
  inProgress?: boolean;
}

export interface DayAvailability {
  total: number;
  free: number;
  slots: TimeSlot[];
}

export type MonthAvailability = Record<string, DayAvailability>;

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  comments: string;
}

export interface BookingState {
  provider: ProviderItem | null;
  service: ServiceItem | null;
  date: string | null;        // "2026-07-15"
  slot: TimeSlot | null;
  form: BookingFormData;
  eventId?: string;
}

export type BookingStep =
  | "provider"
  | "service"
  | "date"
  | "time"
  | "contact"
  | "confirm"
  | "success";

export const BOOKING_STEPS: BookingStep[] = [
  "provider",
  "service",
  "date",
  "time",
  "contact",
  "confirm",
  "success",
];
