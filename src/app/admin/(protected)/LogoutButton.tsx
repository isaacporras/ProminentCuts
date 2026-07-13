"use client";

import { logout } from "./actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm font-medium text-text/60 transition hover:text-primary"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
