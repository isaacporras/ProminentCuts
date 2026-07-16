import type { WorkingHoursConfig, DaySchedule, ScheduleEntry } from "@/types/site-config";

export type TimeFormat = "24h" | "12h";

// Formats a "HH:mm" (24h, zero-padded) string for display. "24h" returns it
// unchanged; "12h" converts to e.g. "4:30 PM".
export function formatTimeLabel(time: string, format: TimeFormat = "24h"): string {
  if (format === "24h") return time;

  const [hourStr, minute] = time.split(":");
  const hour = Number(hourStr);
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
}

export const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

function hoursKey(day: DaySchedule | null | undefined): string {
  return day ? `${day.start}-${day.end}` : "closed";
}

// Groups consecutive days that share the same hours (or are both closed)
// into single entries, e.g. "Lunes a Viernes: 10:00 - 20:00", so the
// human-readable schedule never has to be kept in sync by hand.
export function formatWorkingHoursSchedule(
  workingHours: WorkingHoursConfig,
  timeFormat: TimeFormat = "24h"
): ScheduleEntry[] {
  const entries: ScheduleEntry[] = [];
  let i = 0;
  while (i < DAY_KEYS.length) {
    const day = workingHours[DAY_KEYS[i]];
    const key = hoursKey(day);
    let j = i;
    while (j + 1 < DAY_KEYS.length && hoursKey(workingHours[DAY_KEYS[j + 1]]) === key) {
      j++;
    }
    const label =
      j === i ? DAY_LABELS[DAY_KEYS[i]] : `${DAY_LABELS[DAY_KEYS[i]]} a ${DAY_LABELS[DAY_KEYS[j]]}`;
    const hours = day
      ? `${formatTimeLabel(day.start, timeFormat)} - ${formatTimeLabel(day.end, timeFormat)}`
      : "Cerrado";
    entries.push({ day: label, hours });
    i = j + 1;
  }
  return entries;
}

export function workingHoursFromForm(formData: FormData): WorkingHoursConfig {
  const workingHours: WorkingHoursConfig = {};
  for (const day of DAY_KEYS) {
    const start = String(formData.get(`${day}_start`) ?? "").trim();
    const end = String(formData.get(`${day}_end`) ?? "").trim();
    workingHours[day] = start && end ? { start, end } : null;
  }
  return workingHours;
}
