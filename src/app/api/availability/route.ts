import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getMonthAvailability, DEFAULT_SLOT_INTERVAL_MINUTES } from "@/lib/google-calendar";
import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { providers, settings } from "@/db/schema";

function generalWorkingHours() {
  const row = db.select({ workingHours: settings.workingHours }).from(settings).where(eq(settings.id, "main")).get();
  return row?.workingHours ?? siteConfig.appointments.workingHours;
}

function resolveWorkingHours(calendarId: string) {
  const provider = db
    .select({ workingHours: providers.workingHours })
    .from(providers)
    .where(eq(providers.googleCalendarId, calendarId))
    .get();
  return provider?.workingHours ?? generalWorkingHours();
}

function generalSlotInterval() {
  const row = db
    .select({ slotIntervalMinutes: settings.slotIntervalMinutes })
    .from(settings)
    .where(eq(settings.id, "main"))
    .get();
  return row?.slotIntervalMinutes ?? DEFAULT_SLOT_INTERVAL_MINUTES;
}

function resolveSlotInterval(calendarId: string) {
  const provider = db
    .select({ slotIntervalMinutes: providers.slotIntervalMinutes })
    .from(providers)
    .where(eq(providers.googleCalendarId, calendarId))
    .get();
  return provider?.slotIntervalMinutes ?? generalSlotInterval();
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const calendarId = searchParams.get("calendarId");
  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));
  const duration = Number(searchParams.get("duration"));

  if (!calendarId || !year || !month || !duration) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const availability = await getMonthAvailability(
      calendarId,
      year,
      month,
      duration,
      resolveWorkingHours(calendarId),
      siteConfig.appointments.timezone,
      resolveSlotInterval(calendarId)
    );
    return NextResponse.json(availability);
  } catch (err) {
    console.error("[availability]", err);
    return NextResponse.json({ error: "Error fetching availability" }, { status: 500 });
  }
}
