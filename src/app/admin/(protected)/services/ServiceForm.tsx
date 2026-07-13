"use client";

import type { ServiceItem } from "@/types/site-config";
import { inputBase, labelBase, buttonPrimary, buttonSecondary } from "../../ui";

interface ServiceFormProps {
  service?: ServiceItem;
  action: (formData: FormData) => void;
}

export function ServiceForm({ service, action }: ServiceFormProps) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <div>
        <label className={labelBase}>Nombre</label>
        <input name="name" defaultValue={service?.name} className={inputBase} required />
      </div>

      <div>
        <label className={labelBase}>Descripción</label>
        <textarea
          name="description"
          defaultValue={service?.description}
          rows={3}
          className={inputBase}
          required
        />
      </div>

      <div>
        <label className={labelBase}>Precio (opcional)</label>
        <input
          name="price"
          defaultValue={service?.price ?? undefined}
          placeholder="₡7500"
          className={inputBase}
        />
      </div>

      <div>
        <label className={labelBase}>
          Duración en minutos (opcional — déjalo vacío si no es reservable en línea)
        </label>
        <input
          name="durationMinutes"
          type="number"
          min={1}
          defaultValue={service?.durationMinutes ?? undefined}
          className={inputBase}
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" className={buttonPrimary}>
          Guardar
        </button>
        <a href="/admin/services" className={buttonSecondary}>
          Cancelar
        </a>
      </div>
    </form>
  );
}
