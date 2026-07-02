import { google } from "googleapis";
import { addMinutes, areIntervalsOverlapping, parseISO } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import type { WorkingHoursConfig, DaySchedule } from "@/types/site-config";
import type { MonthAvailability, DayAvailability, TimeSlot } from "@/types/booking";

// Slots are always offered every 30 minutes at minimum.
const SLOT_STEP = 30;

function getCalendarAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

function computeDaySlots(
  dateStr: string, // "2026-07-15" — date in the business timezone
  daySchedule: DaySchedule,
  busyIntervals: { start: Date; end: Date }[],
  durationMinutes: number,
  tz: string
): DayAvailability {
  // Build UTC boundaries from the business local time
  const workStart = fromZonedTime(`${dateStr}T${daySchedule.start}:00`, tz);
  const workEnd   = fromZonedTime(`${dateStr}T${daySchedule.end}:00`, tz);

  const slots: TimeSlot[] = [];
  let cursor = workStart;

  while (addMinutes(cursor, durationMinutes) <= workEnd) {
    const slotEnd = addMinutes(cursor, durationMinutes);
    const isBusy = busyIntervals.some((busy) =>
      areIntervalsOverlapping({ start: cursor, end: slotEnd }, busy, { inclusive: false })
    );
    slots.push({
      start: formatInTimeZone(cursor, tz, "HH:mm"),
      end:   formatInTimeZone(slotEnd, tz, "HH:mm"),
      available: !isBusy,
    });
    cursor = addMinutes(cursor, SLOT_STEP);
  }

  return {
    total: slots.length,
    free:  slots.filter((s) => s.available).length,
    slots,
  };
}

export async function getMonthAvailability(
  calendarId: string,
  year: number,
  month: number, // 1-indexed
  durationMinutes: number,
  workingHours: WorkingHoursConfig,
  tz: string
): Promise<MonthAvailability> {
  const auth = getCalendarAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const mm = String(month).padStart(2, "0");
  // Days in month: Date takes 0-indexed month; passing day=0 of the next month returns the last day
  const daysInMonth = new Date(year, month, 0).getDate();
  const lastDateStr = `${year}-${mm}-${String(daysInMonth).padStart(2, "0")}`;

  // Query range: start and end of the month in business local time → UTC
  const queryStart = fromZonedTime(`${year}-${mm}-01T00:00:00`, tz);
  const queryEnd   = fromZonedTime(`${lastDateStr}T23:59:59`, tz);

  const freebusyRes = await calendar.freebusy.query({
    requestBody: {
      timeMin:  queryStart.toISOString(),
      timeMax:  queryEnd.toISOString(),
      timeZone: tz,
      items: [{ id: calendarId }],
    },
  });

  const calendarData = freebusyRes.data.calendars?.[calendarId];
  const calendarErrors = calendarData?.errors;
  if (calendarErrors && calendarErrors.length > 0) {
    throw new Error(`Calendar not accessible: ${calendarErrors.map((e) => e.reason).join(", ")}`);
  }

  const busyRaw = calendarData?.busy ?? [];
  const busyIntervals = busyRaw
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: parseISO(b.start!), end: parseISO(b.end!) }));

  const result: MonthAvailability = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${mm}-${String(d).padStart(2, "0")}`;

    // Detect weekday using noon in the business timezone to avoid DST edge cases
    const noonUTC = fromZonedTime(`${dateStr}T12:00:00`, tz);
    const weekdayName = formatInTimeZone(noonUTC, tz, "EEEE").toLowerCase() as keyof WorkingHoursConfig;
    const schedule = workingHours[weekdayName];

    if (!schedule) {
      result[dateStr] = { total: 0, free: 0, slots: [] };
      continue;
    }

    // Filter busy intervals that fall on this day in the business timezone
    const dayBusy = busyIntervals.filter(
      (b) => formatInTimeZone(b.start, tz, "yyyy-MM-dd") === dateStr
    );

    result[dateStr] = computeDaySlots(dateStr, schedule, dayBusy, durationMinutes, tz);
  }

  return result;
}

export async function createBookingEvent(
  calendarId: string,
  tz: string,
  event: {
    summary: string;
    description: string;
    date: string;       // "2026-07-15"
    startTime: string;  // "10:00"
    endTime: string;    // "10:30"
    attendeeEmail: string;
  }
) {
  const auth = getCalendarAuth();
  const calendar = google.calendar({ version: "v3", auth });

  const startDateTime = fromZonedTime(`${event.date}T${event.startTime}:00`, tz);
  const endDateTime   = fromZonedTime(`${event.date}T${event.endTime}:00`, tz);

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary:     event.summary,
      description: event.description,
      start: { dateTime: startDateTime.toISOString(), timeZone: tz },
      end:   { dateTime: endDateTime.toISOString(),   timeZone: tz },
      attendees: [{ email: event.attendeeEmail }],
    },
  });

  return res.data;
}
