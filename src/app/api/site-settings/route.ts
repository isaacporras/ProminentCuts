import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { settings } from "@/db/schema";

export const dynamic = "force-dynamic";

// Small, public, read-only slice of `settings` needed by client components
// (the booking wizard) that can't query the DB directly.
export async function GET() {
  const row = db
    .select({ timeFormat: settings.timeFormat })
    .from(settings)
    .where(eq(settings.id, "main"))
    .get();
  return NextResponse.json({ timeFormat: row?.timeFormat ?? "24h" });
}
