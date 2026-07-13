"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { siteConfig } from "@/config/site.config";
import { inputBase, buttonPrimary, cardBase } from "../ui";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-heading text-2xl font-semibold text-bg">
            {siteConfig.business.name}
          </p>
          <div className="mx-auto mt-3 h-px w-10 bg-accent" />
          <p className="mt-3 text-xs tracking-[0.2em] text-bg/40 uppercase">
            Panel de administración
          </p>
        </div>
        <form action={formAction} className={`${cardBase} flex flex-col gap-4 p-6`}>
          <input
            name="username"
            placeholder="Usuario"
            autoComplete="username"
            className={inputBase}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            className={inputBase}
            required
          />
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button type="submit" disabled={pending} className={buttonPrimary}>
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
