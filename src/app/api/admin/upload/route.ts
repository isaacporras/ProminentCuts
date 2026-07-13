import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getSession } from "@/lib/auth";
import { PROVIDER_PHOTO_DIR, PROVIDER_PHOTO_URL_PREFIX } from "@/lib/provider-photo";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION_PX = 4000;

const ALLOWED_TYPES: Record<string, { extension: string; format: "jpeg" | "png" | "webp" }> = {
  "image/jpeg": { extension: "jpg", format: "jpeg" },
  "image/png": { extension: "png", format: "png" },
  "image/webp": { extension: "webp", format: "webp" },
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }

  // file.type is client-declared and not trustworthy on its own (this
  // endpoint can be hit directly, not just through the file picker) — it
  // only picks which format we'll force the real decode below into.
  const declared = ALLOWED_TYPES[file.type];
  if (!declared) {
    return NextResponse.json({ error: "Formato no soportado" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "La imagen es muy grande (máx. 5MB)" }, { status: 400 });
  }

  const rawBytes = Buffer.from(await file.arrayBuffer());

  // Decode + re-encode with sharp: proves the bytes are actually a valid
  // image (rejects spoofed content-types), auto-applies EXIF orientation
  // and then strips EXIF (GPS/camera info) since it's about to be served
  // publicly, and normalizes to the declared format.
  let processed: Buffer;
  let width: number | undefined;
  let height: number | undefined;
  try {
    const image = sharp(rawBytes).rotate();
    ({ width, height } = await image.metadata());
    processed = await image.toFormat(declared.format).toBuffer();
  } catch {
    return NextResponse.json({ error: "El archivo no es una imagen válida" }, { status: 400 });
  }

  if (!width || !height || width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
    return NextResponse.json(
      { error: `La imagen es demasiado grande (máx. ${MAX_DIMENSION_PX}x${MAX_DIMENSION_PX}px)` },
      { status: 400 }
    );
  }

  const filename = `${crypto.randomUUID()}.${declared.extension}`;
  await mkdir(PROVIDER_PHOTO_DIR, { recursive: true });
  await writeFile(path.join(PROVIDER_PHOTO_DIR, filename), processed);

  return NextResponse.json({ url: `${PROVIDER_PHOTO_URL_PREFIX}${filename}` });
}
