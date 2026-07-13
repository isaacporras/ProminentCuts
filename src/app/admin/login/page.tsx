"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { inputBase, buttonPrimary } from "../ui";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-6 text-xl font-bold text-primary">Panel de administración</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <input
            name="username"
            placeholder="Usuario"
            autoComplete="username"
            className={inputBase}
            required
          />
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            className={inputBase}
            required
          />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
