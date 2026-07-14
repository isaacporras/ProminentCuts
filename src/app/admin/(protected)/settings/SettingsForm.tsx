"use client";

import { useActionState } from "react";
import type { settings } from "@/db/schema";
import type { SocialPlatform } from "@/types/site-config";
import { DAY_KEYS, DAY_LABELS } from "@/lib/schedule";
import { updateSettings } from "./actions";
import { inputBase, labelBase, buttonPrimary, cardBase, eyebrow } from "../../ui";

const SOCIAL_FIELDS: { platform: SocialPlatform; label: string }[] = [
  { platform: "instagram", label: "Instagram" },
  { platform: "tiktok", label: "TikTok" },
  { platform: "facebook", label: "Facebook" },
  { platform: "x", label: "X" },
  { platform: "whatsapp", label: "WhatsApp" },
];

interface SettingsFormProps {
  settings: typeof settings.$inferSelect | undefined;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateSettings, undefined);

  const socialsByPlatform = Object.fromEntries(
    (settings?.contactSocials ?? []).map((s) => [s.platform, s.url])
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className={`${cardBase} p-6`}>
        <legend className={eyebrow}>Horario general</legend>
        <p className="mt-1 text-xs text-text/45">
          Se usa para las citas en línea y se muestra en el sitio. Dejá un día vacío para marcarlo
          como cerrado.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {DAY_KEYS.map((key) => {
            const day = settings?.workingHours?.[key];
            return (
              <div key={key} className="grid grid-cols-3 items-center gap-2">
                <span className="text-sm text-text/70">{DAY_LABELS[key]}</span>
                <input
                  type="time"
                  name={`${key}_start`}
                  defaultValue={day?.start ?? ""}
                  className={inputBase}
                />
                <input
                  type="time"
                  name={`${key}_end`}
                  defaultValue={day?.end ?? ""}
                  className={inputBase}
                />
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className={`${cardBase} flex flex-col gap-5 p-6`}>
        <p className={eyebrow}>Contacto</p>

        <div>
          <label className={labelBase}>Teléfono</label>
          <input
            name="contactPhone"
            defaultValue={settings?.contactPhone ?? undefined}
            className={inputBase}
            placeholder="+506 87931306"
          />
        </div>

        <div>
          <label className={labelBase}>Correo</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={settings?.contactEmail ?? undefined}
            className={inputBase}
          />
        </div>
      </div>

      <fieldset className={`${cardBase} flex flex-col gap-3 p-6`}>
        <legend className={eyebrow}>Redes sociales</legend>
        <p className="-mt-2 text-xs text-text/45">Opcional</p>
        <div className="grid grid-cols-2 gap-3">
          {SOCIAL_FIELDS.map(({ platform, label }) => (
            <input
              key={platform}
              name={`social_${platform}`}
              defaultValue={socialsByPlatform[platform] ?? ""}
              placeholder={label}
              className={inputBase}
            />
          ))}
        </div>
      </fieldset>

      {state?.success && <p className="text-sm text-green-600">Configuración guardada.</p>}
      <div>
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
