"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { galleryImages } from "@/db/schema";
import { requireSession } from "@/lib/auth";
import { deleteUpload } from "@/lib/uploads";
import { MAX_GALLERY_IMAGES } from "@/lib/limits";

export async function addGalleryImage(url: string): Promise<{ error?: string }> {
  await requireSession();

  const { count } = db.select({ count: sql<number>`count(*)` }).from(galleryImages).get() ?? { count: 0 };
  if (count >= MAX_GALLERY_IMAGES) {
    await deleteUpload("gallery", url); // don't leave the already-uploaded file orphaned
    return { error: `Ya tenés el máximo de ${MAX_GALLERY_IMAGES} imágenes. Borrá una para subir otra.` };
  }

  const { max } = db
    .select({ max: sql<number | null>`max(${galleryImages.sortOrder})` })
    .from(galleryImages)
    .get() ?? { max: null };

  db.insert(galleryImages)
    .values({ id: crypto.randomUUID(), url, sortOrder: (max ?? -1) + 1 })
    .run();

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return {};
}

export async function deleteGalleryImage(id: string) {
  await requireSession();

  const existing = db.select().from(galleryImages).where(eq(galleryImages.id, id)).get();
  db.delete(galleryImages).where(eq(galleryImages.id, id)).run();
  if (existing) await deleteUpload("gallery", existing.url);

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

export async function moveGalleryImage(id: string, direction: "up" | "down") {
  await requireSession();

  const images = db.select().from(galleryImages).orderBy(galleryImages.sortOrder).all();
  const index = images.findIndex((img) => img.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= images.length) return;

  const current = images[index];
  const neighbor = images[swapWith];
  db.update(galleryImages).set({ sortOrder: neighbor.sortOrder }).where(eq(galleryImages.id, current.id)).run();
  db.update(galleryImages).set({ sortOrder: current.sortOrder }).where(eq(galleryImages.id, neighbor.id)).run();

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
