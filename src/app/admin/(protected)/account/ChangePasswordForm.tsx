"use client";

import { useActionState } from "react";
import { changePassword } from "./actions";
import { inputBase, labelBase, buttonPrimary, cardBase, eyebrow } from "../../ui";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, undefined);

  return (
    <form action={formAction} className={`${cardBase} flex max-w-sm flex-col gap-4 p-6`}>
      <p className={eyebrow}>Seguridad</p>
      <div>
        <label className={labelBase}>Contraseña actual</label>
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          className={inputBase}
          required
        />
      </div>
      <div>
        <label className={labelBase}>Nueva contraseña</label>
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          className={inputBase}
          required
          minLength={8}
        />
      </div>
      <div>
        <label className={labelBase}>Confirmar nueva contraseña</label>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={inputBase}
          required
          minLength={8}
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">Contraseña actualizada.</p>}
      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
