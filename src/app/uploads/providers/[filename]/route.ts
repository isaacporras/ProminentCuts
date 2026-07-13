import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  PROVIDER_PHOTO_DIR,
  PROVIDER_PHOTO_FILENAME_RE,
  PROVIDER_PHOTO_CONTENT_TYPES,
} from "@/lib/provider-photo";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!PROVIDER_PHOTO_FILENAME_RE.test(filename)) {
    return new NextResponse(null, { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await readFile(path.join(PROVIDER_PHOTO_DIR, filename));
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  const extension = filename.split(".").pop() ?? "";
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": PROVIDER_PHOTO_CONTENT_TYPES[extension] ?? "application/octet-stream",
      // Safe to cache forever: filenames are random UUIDs, never reused or
      // overwritten in place — a changed photo always gets a new filename.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
