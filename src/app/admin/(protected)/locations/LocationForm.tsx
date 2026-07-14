"use client";

import type { LocationItem } from "@/types/site-config";
import { inputBase, labelBase, buttonPrimary, buttonSecondary, cardBase } from "../../ui";

interface LocationFormProps {
  location?: LocationItem;
  action: (formData: FormData) => void;
}

export function LocationForm({ location, action }: LocationFormProps) {
  return (
    <form action={action} className="flex flex-col gap-6">
      <div className={`${cardBase} flex flex-col gap-5 p-6`}>
        <div>
          <label className={labelBase}>Dirección</label>
          <textarea
            name="address"
            defaultValue={location?.address}
            rows={2}
            className={inputBase}
            required
          />
        </div>

        <div>
          <label className={labelBase}>Mapa de Google (opcional)</label>
          <input
            name="mapEmbedUrl"
            defaultValue={location?.mapEmbedUrl ?? undefined}
            className={inputBase}
            placeholder="https://www.google.com/maps/embed?..."
          />
          <p className="mt-1.5 text-xs text-text/45">
            En Google Maps: buscá el lugar → Compartir → Insertar un mapa → copiá la URL de adentro
            del <code>src=&quot;...&quot;</code>.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" className={buttonPrimary}>
          Guardar
        </button>
        <a href="/admin/locations" className={buttonSecondary}>
          Cancelar
        </a>
      </div>
    </form>
  );
}
