import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { providers } from "@/db/schema";

export async function GET() {
  const rows = db.select().from(providers).all();
  return NextResponse.json(rows);
}
