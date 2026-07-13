"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Ingresa usuario y contraseña." };
  }

  const user = db.select().from(adminUsers).where(eq(adminUsers.username, username)).get();
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await createSession(user.id);
  redirect("/admin");
}
