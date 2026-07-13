"use client";

import { buttonDanger } from "../ui";

export function DeleteButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("¿Seguro que quieres eliminarlo?")) e.preventDefault();
      }}
    >
      <button type="submit" className={buttonDanger}>
        Eliminar
      </button>
    </form>
  );
}
