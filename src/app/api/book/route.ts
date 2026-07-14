import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getMonthAvailability, createBookingEvent } from "@/lib/google-calendar";
import { sendConfirmationEmail, sendProviderBookingNotification } from "@/lib/mailer";
import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { providers, settings } from "@/db/schema";
import { parseISO, getMonth, getYear } from "date-fns";

function findProviderByCalendarId(calendarId: string) {
  return db.select().from(providers).where(eq(providers.googleCalendarId, calendarId)).get();
}

function generalWorkingHours() {
  const row = db.select({ workingHours: settings.workingHours }).from(settings).where(eq(settings.id, "main")).get();
  return row?.workingHours ?? siteConfig.appointments.workingHours;
}

function resolveWorkingHours(calendarId: string) {
  return findProviderByCalendarId(calendarId)?.workingHours ?? generalWorkingHours();
}

interface BookRequest {
  calendarId: string;
  serviceName: string;
  date: string;       // "2026-07-15"
  startTime: string;  // "10:00"
  endTime: string;    // "10:30"
  duration: number;
  provider: { name: string };
  client: { name: string; email: string; phone: string; comments?: string };
}

export async function POST(req: NextRequest) {
  let body: BookRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { calendarId, serviceName, date, startTime, endTime, duration, provider, client } = body;

  if (!calendarId || !date || !startTime || !endTime || !client?.email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Re-verify the slot is still free before confirming
  try {
    const dateObj = parseISO(date);
    const availability = await getMonthAvailability(
      calendarId,
      getYear(dateObj),
      getMonth(dateObj) + 1,
      duration,
      resolveWorkingHours(calendarId),
      siteConfig.appointments.timezone
    );

    const daySlots = availability[date]?.slots ?? [];
    const slotStillFree = daySlots.some(
      (s) => s.start === startTime && s.end === endTime && s.available
    );

    if (!slotStillFree) {
      return NextResponse.json(
        { error: "Este horario ya no está disponible. Por favor elige otro." },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error("[book] availability check failed", err);
    return NextResponse.json({ error: "Error verificando disponibilidad" }, { status: 500 });
  }

  // Create calendar event
  let eventId: string | undefined;
  try {
    const event = await createBookingEvent(calendarId, siteConfig.appointments.timezone, {
      summary: `${serviceName} — ${client.name}`,
      description: [
        `Cliente: ${client.name}`,
        `Teléfono: ${client.phone}`,
        `Email: ${client.email}`,
        client.comments ? `Comentarios: ${client.comments}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      date,
      startTime,
      endTime,
    });
    eventId = event.id ?? undefined;
  } catch (err) {
    console.error("[book] calendar insert failed", err);
    return NextResponse.json({ error: "Error creando la cita en el calendario" }, { status: 500 });
  }

  // Send confirmation + notification emails (non-blocking failure — the
  // booking is already on the calendar either way).
  try {
    await sendConfirmationEmail({
      providerName: provider.name,
      serviceName,
      date,
      startTime,
      endTime,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
      comments: client.comments,
    });
  } catch (err) {
    console.error("[book] client confirmation email failed (non-fatal)", err);
  }

  const providerEmail = findProviderByCalendarId(calendarId)?.email;
  if (providerEmail) {
    try {
      await sendProviderBookingNotification({
        providerEmail,
        providerName: provider.name,
        serviceName,
        date,
        startTime,
        endTime,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        comments: client.comments,
      });
    } catch (err) {
      console.error("[book] provider notification email failed (non-fatal)", err);
    }
  }

  return NextResponse.json({ success: true, eventId });
}
