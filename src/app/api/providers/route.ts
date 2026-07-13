import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { providers } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = db.select().from(providers).all();
  return NextResponse.json(rows);
}
