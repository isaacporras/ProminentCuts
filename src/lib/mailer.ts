import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { locations, settings } from "@/db/schema";

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

interface BookingEmailData {
  providerName: string;
  serviceName: string;
  date: string;       // "2026-07-15"
  startTime: string;  // "10:00"
  endTime: string;    // "10:30"
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  comments?: string;
}

function formatBookingDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function sendConfirmationEmail(data: BookingEmailData) {
  const transporter = getTransporter();

  const formattedDate = formatBookingDate(data.date);
  // Primary (first) location and phone — falls back to the static config
  // seed until a business has set these from /admin.
  const primaryLocation = db.select().from(locations).orderBy(locations.sortOrder).limit(1).get();
  const address = primaryLocation?.address ?? siteConfig.location?.address ?? "";
  const settingsRow = db.select().from(settings).where(eq(settings.id, "main")).get();
  const phone = settingsRow?.contactPhone ?? siteConfig.contact.phone;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;color:${siteConfig.theme.text}">
      <div style="background:${siteConfig.theme.primary};padding:24px 32px">
        <h1 style="color:${siteConfig.theme.secondary};margin:0;font-size:22px">${siteConfig.business.name}</h1>
        <p style="color:${siteConfig.theme.background};margin:4px 0 0;font-size:13px">${siteConfig.business.tagline}</p>
      </div>
      <div style="padding:32px">
        <h2 style="margin:0 0 8px">¡Cita confirmada, ${data.clientName}!</h2>
        <p style="color:#555;margin:0 0 24px">Aquí está el resumen de tu reserva:</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:140px">${siteConfig.terminology.providerSingular}</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${data.providerName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Servicio</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${data.serviceName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Fecha</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Hora</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${data.startTime} – ${data.endTime}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#888">Dirección</td>
            <td style="padding:10px 0;font-weight:600">${address}</td>
          </tr>
        </table>
        ${data.comments ? `<p style="margin:24px 0 0;padding:16px;background:#f9f4ec;border-radius:8px;font-style:italic">"${data.comments}"</p>` : ""}
        <p style="margin:32px 0 0;font-size:13px;color:#888">
          Si necesitas cambiar o cancelar tu cita, contáctanos al
          <a href="tel:${phone}" style="color:${siteConfig.theme.secondary}">${phone}</a>.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${siteConfig.business.name}" <${process.env.GMAIL_USER}>`,
    to: data.clientEmail,
    subject: `✅ Cita confirmada — ${data.serviceName} el ${formattedDate}`,
    html,
  });
}

interface ProviderNotificationData {
  providerEmail: string;
  providerName: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  comments?: string;
}

// Notifies the provider a client just booked with them — separate from
// sendConfirmationEmail (which goes to the client) and independent of
// whether the booking landed on their personal calendar inbox or a
// dedicated one (see googleCalendarId vs. providers.email).
export async function sendProviderBookingNotification(data: ProviderNotificationData) {
  const transporter = getTransporter();

  const formattedDate = formatBookingDate(data.date);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:540px;margin:0 auto;color:${siteConfig.theme.text}">
      <div style="background:${siteConfig.theme.primary};padding:24px 32px">
        <h1 style="color:${siteConfig.theme.secondary};margin:0;font-size:22px">${siteConfig.business.name}</h1>
        <p style="color:${siteConfig.theme.background};margin:4px 0 0;font-size:13px">Nueva cita agendada</p>
      </div>
      <div style="padding:32px">
        <h2 style="margin:0 0 8px">Tenés una cita nueva, ${data.providerName}</h2>
        <p style="color:#555;margin:0 0 24px">Ya quedó agendada en tu calendario. Acá el resumen:</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:140px">Servicio</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${data.serviceName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Fecha</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Hora</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${data.startTime} – ${data.endTime}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Cliente</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${data.clientName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;color:#888">Teléfono</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">
              <a href="tel:${data.clientPhone}" style="color:${siteConfig.theme.secondary}">${data.clientPhone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#888">Correo</td>
            <td style="padding:10px 0;font-weight:600">${data.clientEmail}</td>
          </tr>
        </table>
        ${data.comments ? `<p style="margin:24px 0 0;padding:16px;background:#f9f4ec;border-radius:8px;font-style:italic">"${data.comments}"</p>` : ""}
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"${siteConfig.business.name}" <${process.env.GMAIL_USER}>`,
    to: data.providerEmail,
    subject: `📅 Nueva cita — ${data.serviceName} el ${formattedDate}`,
    html,
  });
}
