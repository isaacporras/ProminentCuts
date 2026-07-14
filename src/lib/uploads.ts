import { unlink, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";

const DATABASE_PATH = process.env.DATABASE_PATH ?? "./data/app.db";
// Lives next to the SQLite file (same persistent volume in Docker), not
// under public/: Next's standalone server only discovers public/ files that
// exist at build time, so anything written there at runtime 404s until the
// process restarts. Served instead by src/app/uploads/[namespace]/[filename]
// route handlers, which read the file live on every request.
const UPLOADS_ROOT = path.join(path.dirname(DATABASE_PATH), "uploads");

// Matches the exact filenames the upload endpoints generate (crypto.randomUUID() + extension).
export const UPLOAD_FILENAME_RE = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

export const UPLOAD_CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function uploadDir(namespace: string) {
  return path.join(UPLOADS_ROOT, namespace);
}

export function uploadUrlPrefix(namespace: string) {
  return `/uploads/${namespace}/`;
}

// Only ever deletes files this app itself wrote via an upload endpoint —
// never touches manually-placed brand assets, even if the URL was
// hand-edited to point somewhere odd.
export async function deleteUpload(namespace: string, url: string | null | undefined) {
  const prefix = uploadUrlPrefix(namespace);
  if (!url?.startsWith(prefix)) return;
  const filename = url.slice(prefix.length);
  if (!UPLOAD_FILENAME_RE.test(filename)) return;

  try {
    await unlink(path.join(uploadDir(namespace), filename));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
}

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_UPLOAD_DIMENSION_PX = 4000;

const ALLOWED_UPLOAD_TYPES: Record<string, { extension: string; format: "jpeg" | "png" | "webp" }> = {
  "image/jpeg": { extension: "jpg", format: "jpeg" },
  "image/png": { extension: "png", format: "png" },
  "image/webp": { extension: "webp", format: "webp" },
};

// Validates, decodes and re-encodes an uploaded image, then writes it under
// the given namespace. Used by every /api/admin/upload/* route so each one
// doesn't have to re-implement the same sharp/EXIF/dimension handling.
export async function saveUpload(
  namespace: string,
  file: File
): Promise<{ url: string } | { error: string; status: number }> {
  // file.type is client-declared and not trustworthy on its own (these
  // endpoints can be hit directly, not just through a file picker) — it
  // only picks which format we'll force the real decode below into.
  const declared = ALLOWED_UPLOAD_TYPES[file.type];
  if (!declared) {
    return { error: "Formato no soportado", status: 400 };
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return { error: "La imagen es muy grande (máx. 5MB)", status: 400 };
  }

  const rawBytes = Buffer.from(await file.arrayBuffer());

  // Decode + re-encode with sharp: proves the bytes are actually a valid
  // image (rejects spoofed content-types), auto-applies EXIF orientation
  // and then strips EXIF (GPS/camera info) since it's about to be served
  // publicly, and normalizes to the declared format.
  let buffer: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  try {
    const image = sharp(rawBytes).rotate();
    ({ width, height } = await image.metadata());
    buffer = await image.toFormat(declared.format).toBuffer();
  } catch {
    return { error: "El archivo no es una imagen válida", status: 400 };
  }

  if (!width || !height || width > MAX_UPLOAD_DIMENSION_PX || height > MAX_UPLOAD_DIMENSION_PX) {
    return {
      error: `La imagen es demasiado grande (máx. ${MAX_UPLOAD_DIMENSION_PX}x${MAX_UPLOAD_DIMENSION_PX}px)`,
      status: 400,
    };
  }

  const filename = `${crypto.randomUUID()}.${declared.extension}`;
  const dir = uploadDir(namespace);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  return { url: `${uploadUrlPrefix(namespace)}${filename}` };
}

// Backs the src/app/uploads/[namespace]/[filename] route handlers: reads
// the file live from disk on every request instead of relying on Next's
// build-time-only public/ static serving (see UPLOADS_ROOT comment above).
export async function serveUpload(namespace: string, filename: string) {
  if (!UPLOAD_FILENAME_RE.test(filename)) {
    return new NextResponse(null, { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await readFile(path.join(uploadDir(namespace), filename));
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  const extension = filename.split(".").pop() ?? "";
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": UPLOAD_CONTENT_TYPES[extension] ?? "application/octet-stream",
      // Safe to cache forever: filenames are random UUIDs, never reused or
      // overwritten in place — a changed photo always gets a new filename.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
