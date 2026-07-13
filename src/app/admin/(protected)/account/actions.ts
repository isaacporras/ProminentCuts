"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { adminUsers } from "@/db/schema";
import { requireSession, hashPassword, verifyPassword } from "@/lib/auth";

export interface ChangePasswordState {
  error?: string;
  success?: boolean;
}

export async function changePassword(
  _prevState: ChangePasswordState | undefined,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await requireSession();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Las contraseñas nuevas no coinciden." };
  }

  const user = db.select().from(adminUsers).where(eq(adminUsers.id, session.userId)).get();
  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { error: "La contraseña actual es incorrecta." };
  }

  db.update(adminUsers)
    .set({ passwordHash: await hashPassword(newPassword), updatedAt: new Date() })
    .where(eq(adminUsers.id, user.id))
    .run();

  return { success: true };
}
