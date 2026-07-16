"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { workingHoursFromForm } from "@/lib/schedule";
import type { SocialLink, SocialPlatform } from "@/types/site-config";

const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook", "x", "whatsapp"];

function slotIntervalFromForm(formData: FormData): number | null {
  const raw = String(formData.get("slotIntervalMinutes") ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

function timeFormatFromForm(formData: FormData): "24h" | "12h" {
  return formData.get("timeFormat") === "12h" ? "12h" : "24h";
}

function socialsFromForm(formData: FormData): SocialLink[] {
  const socials: SocialLink[] = [];
  for (const platform of SOCIAL_PLATFORMS) {
    const url = String(formData.get(`social_${platform}`) ?? "").trim();
    if (url) socials.push({ platform, url });
  }
  return socials;
}

export async function updateSettings(_prevState: { success?: boolean } | undefined, formData: FormData) {
  await requireSession();

  const values = {
    workingHours: workingHoursFromForm(formData),
    contactPhone: String(formData.get("contactPhone") ?? "").trim() || null,
    contactEmail: String(formData.get("contactEmail") ?? "").trim() || null,
    contactSocials: socialsFromForm(formData),
    slotIntervalMinutes: slotIntervalFromForm(formData),
    timeFormat: timeFormatFromForm(formData),
  };

  const existing = db.select({ id: settings.id }).from(settings).where(eq(settings.id, "main")).get();
  if (existing) {
    db.update(settings).set(values).where(eq(settings.id, "main")).run();
  } else {
    db.insert(settings).values({ id: "main", ...values }).run();
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
