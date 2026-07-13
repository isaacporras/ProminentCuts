import { unlink } from "node:fs/promises";
import path from "node:path";

const DATABASE_PATH = process.env.DATABASE_PATH ?? "./data/app.db";

export const PROVIDER_PHOTO_URL_PREFIX = "/uploads/providers/";
// Lives next to the SQLite file (same persistent volume in Docker), not
// under public/: Next's standalone server only discovers public/ files that
// exist at build time, so anything written there at runtime 404s until the
// process restarts. Served instead by
// src/app/uploads/providers/[filename]/route.ts, which reads it live.
export const PROVIDER_PHOTO_DIR = path.join(path.dirname(DATABASE_PATH), "uploads", "providers");
// Matches the exact filenames /api/admin/upload generates (crypto.randomUUID() + extension).
export const PROVIDER_PHOTO_FILENAME_RE = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

export const PROVIDER_PHOTO_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// Only ever deletes files this app itself wrote via /api/admin/upload —
// never touches manually-placed brand assets like a business's seeded
// team photo, even if photoUrl was hand-edited to point somewhere odd.
export async function deleteProviderPhoto(photoUrl: string | null | undefined) {
  if (!photoUrl?.startsWith(PROVIDER_PHOTO_URL_PREFIX)) return;
  const filename = photoUrl.slice(PROVIDER_PHOTO_URL_PREFIX.length);
  if (!PROVIDER_PHOTO_FILENAME_RE.test(filename)) return;

  const filePath = path.join(PROVIDER_PHOTO_DIR, filename);
  try {
    await unlink(filePath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}
