"use client";

import { logout } from "./actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm font-medium text-bg/50 transition hover:text-bg"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
