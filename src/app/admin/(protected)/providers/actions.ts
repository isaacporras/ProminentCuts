"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { providers } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { deleteProviderPhoto } from "@/lib/provider-photo";
import { workingHoursFromForm as parseWorkingHours } from "@/lib/schedule";
import { MAX_PROVIDERS } from "@/lib/limits";
import type { SocialLink, SocialPlatform, WorkingHoursConfig } from "@/types/site-config";

// No "whatsapp" here — providers use the dedicated `phone` field for that.
const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook", "x"];

function socialsFromForm(formData: FormData): SocialLink[] {
  const socials: SocialLink[] = [];
  for (const platform of SOCIAL_PLATFORMS) {
    const url = String(formData.get(`social_${platform}`) ?? "").trim();
    if (url) socials.push({ platform, url });
  }
  return socials;
}

// Providers only store hours when they differ from the business's general
// schedule — the checkbox gates whether this returns anything at all.
function customWorkingHoursFromForm(formData: FormData): WorkingHoursConfig | null {
  if (formData.get("customHours") !== "on") return null;
  return parseWorkingHours(formData);
}

// Same gating pattern as customWorkingHoursFromForm: only stored when the
// provider opts out of the business-wide default via the checkbox.
function customSlotIntervalFromForm(formData: FormData): number | null {
  if (formData.get("customSlotInterval") !== "on") return null;
  const raw = String(formData.get("slotIntervalMinutes") ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

interface ProviderFormValues {
  name: string;
  role: string;
  bio: string;
  photoUrl: string | null;
  email: string | null;
  phone: string | null;
  googleCalendarId: string | null;
  socials: SocialLink[];
  workingHours: WorkingHoursConfig | null;
  slotIntervalMinutes: number | null;
}

function valuesFromForm(formData: FormData): ProviderFormValues {
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    googleCalendarId: String(formData.get("googleCalendarId") ?? "").trim() || null,
    socials: socialsFromForm(formData),
    workingHours: customWorkingHoursFromForm(formData),
    slotIntervalMinutes: customSlotIntervalFromForm(formData),
  };
}

export async function createProvider(formData: FormData) {
  await requireSession();

  // Primary guard is hiding "Agregar" on the list page once at the limit —
  // this only matters if someone reaches the form another way (old tab,
  // direct URL) after that.
  const { count } = db.select({ count: sql<number>`count(*)` }).from(providers).get() ?? { count: 0 };
  if (count >= MAX_PROVIDERS) {
    redirect("/admin/providers");
  }

  const values = valuesFromForm(formData);

  db.insert(providers)
    .values({ id: crypto.randomUUID(), ...values })
    .run();

  revalidatePath("/admin/providers");
  revalidatePath("/");
  redirect("/admin/providers");
}

export async function updateProvider(id: string, formData: FormData) {
  await requireSession();
  const values = valuesFromForm(formData);

  const previous = db
    .select({ photoUrl: providers.photoUrl })
    .from(providers)
    .where(eq(providers.id, id))
    .get();

  db.update(providers).set(values).where(eq(providers.id, id)).run();

  if (previous && previous.photoUrl !== values.photoUrl) {
    await deleteProviderPhoto(previous.photoUrl);
  }

  revalidatePath("/admin/providers");
  revalidatePath("/");
  redirect("/admin/providers");
}

export async function deleteProvider(id: string) {
  await requireSession();

  const existing = db
    .select({ photoUrl: providers.photoUrl })
    .from(providers)
    .where(eq(providers.id, id))
    .get();

  db.delete(providers).where(eq(providers.id, id)).run();
  if (existing) await deleteProviderPhoto(existing.photoUrl);

  revalidatePath("/admin/providers");
  revalidatePath("/");
}
