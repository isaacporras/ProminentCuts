import { NextRequest, NextResponse } from "next/server";
import { getMonthAvailability } from "@/lib/google-calendar";
import { siteConfig } from "@/config/site.config";

function resolveWorkingHours(calendarId: string) {
  const provider = siteConfig.providers.find((p) => p.googleCalendarId === calendarId);
  return provider?.workingHours ?? siteConfig.appointments.workingHours;
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
      siteConfig.appointments.timezone
    );
    return NextResponse.json(availability);
  } catch (err) {
    console.error("[availability]", err);
    return NextResponse.json({ error: "Error fetching availability" }, { status: 500 });
  }
}
