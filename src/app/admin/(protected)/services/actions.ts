"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { requireSession } from "@/lib/auth";

interface ServiceFormValues {
  name: string;
  description: string;
  price: string | null;
  durationMinutes: number | null;
}

function valuesFromForm(formData: FormData): ServiceFormValues {
  const durationRaw = String(formData.get("durationMinutes") ?? "").trim();
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim() || null,
    durationMinutes: durationRaw ? Number(durationRaw) : null,
  };
}

export async function createService(formData: FormData) {
  await requireSession();
  const values = valuesFromForm(formData);

  db.insert(services)
    .values({ id: crypto.randomUUID(), ...values })
    .run();

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(id: string, formData: FormData) {
  await requireSession();
  const values = valuesFromForm(formData);

  db.update(services).set(values).where(eq(services.id, id)).run();

  revalidatePath("/admin/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requireSession();
  db.delete(services).where(eq(services.id, id)).run();
  revalidatePath("/admin/services");
  revalidatePath("/");
}
