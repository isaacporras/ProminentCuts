"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { requireSession } from "@/lib/auth";

interface LocationFormValues {
  address: string;
  mapEmbedUrl: string | null;
}

function valuesFromForm(formData: FormData): LocationFormValues {
  return {
    address: String(formData.get("address") ?? "").trim(),
    mapEmbedUrl: String(formData.get("mapEmbedUrl") ?? "").trim() || null,
  };
}

export async function createLocation(formData: FormData) {
  await requireSession();
  const values = valuesFromForm(formData);

  const { max } = db
    .select({ max: sql<number | null>`max(${locations.sortOrder})` })
    .from(locations)
    .get() ?? { max: null };

  db.insert(locations)
    .values({ id: crypto.randomUUID(), sortOrder: (max ?? -1) + 1, ...values })
    .run();

  revalidatePath("/admin/locations");
  revalidatePath("/");
  redirect("/admin/locations");
}

export async function updateLocation(id: string, formData: FormData) {
  await requireSession();
  const values = valuesFromForm(formData);

  db.update(locations).set(values).where(eq(locations.id, id)).run();

  revalidatePath("/admin/locations");
  revalidatePath("/");
  redirect("/admin/locations");
}

export async function deleteLocation(id: string) {
  await requireSession();
  db.delete(locations).where(eq(locations.id, id)).run();
  revalidatePath("/admin/locations");
  revalidatePath("/");
}
