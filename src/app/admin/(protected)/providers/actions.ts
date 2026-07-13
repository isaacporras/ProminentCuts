"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { providers } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { deleteProviderPhoto } from "@/lib/provider-photo";
import type { SocialLink, SocialPlatform, WorkingHoursConfig } from "@/types/site-config";

const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook", "x", "whatsapp"];
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function socialsFromForm(formData: FormData): SocialLink[] {
  const socials: SocialLink[] = [];
  for (const platform of SOCIAL_PLATFORMS) {
    const url = String(formData.get(`social_${platform}`) ?? "").trim();
    if (url) socials.push({ platform, url });
  }
  return socials;
}

function workingHoursFromForm(formData: FormData): WorkingHoursConfig | null {
  if (formData.get("customHours") !== "on") return null;

  const workingHours: WorkingHoursConfig = {};
  for (const day of DAYS) {
    const start = String(formData.get(`${day}_start`) ?? "").trim();
    const end = String(formData.get(`${day}_end`) ?? "").trim();
    workingHours[day] = start && end ? { start, end } : null;
  }
  return workingHours;
}

interface ProviderFormValues {
  name: string;
  role: string;
  bio: string;
  photoUrl: string | null;
  email: string | null;
  googleCalendarId: string | null;
  socials: SocialLink[];
  workingHours: WorkingHoursConfig | null;
}

function valuesFromForm(formData: FormData): ProviderFormValues {
  return {
    name: String(formData.get("name") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    googleCalendarId: String(formData.get("googleCalendarId") ?? "").trim() || null,
    socials: socialsFromForm(formData),
    workingHours: workingHoursFromForm(formData),
  };
}

export async function createProvider(formData: FormData) {
  await requireSession();
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
