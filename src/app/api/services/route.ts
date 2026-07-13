import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { services } from "@/db/schema";

export async function GET() {
  const rows = db.select().from(services).all();
  return NextResponse.json(rows);
}
