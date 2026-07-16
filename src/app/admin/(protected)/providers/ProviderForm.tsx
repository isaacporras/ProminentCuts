"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProviderItem, SocialPlatform } from "@/types/site-config";
import { DAY_KEYS, DAY_LABELS } from "@/lib/schedule";
import {
  inputBase,
  labelBase,
  buttonPrimary,
  buttonSecondary,
  cardBase,
  eyebrow,
  fileInput,
} from "../../ui";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB — debe coincidir con /api/admin/upload
const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
};

const SOCIAL_FIELDS: { platform: SocialPlatform; label: string }[] = [
  { platform: "instagram", label: "Instagram" },
  { platform: "tiktok", label: "TikTok" },
  { platform: "facebook", label: "Facebook" },
  { platform: "x", label: "X" },
  { platform: "whatsapp", label: "WhatsApp" },
];

interface ProviderFormProps {
  provider?: ProviderItem;
  action: (formData: FormData) => void;
}

export function ProviderForm({ provider, action }: ProviderFormProps) {
  const [photoUrl, setPhotoUrl] = useState(provider?.photoUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasCustomHours, setHasCustomHours] = useState(!!provider?.workingHours);
  const [hasCustomSlotInterval, setHasCustomSlotInterval] = useState(
    provider?.slotIntervalMinutes != null
  );

  const socialsByPlatform = Object.fromEntries(
    (provider?.socials ?? []).map((s) => [s.platform, s.url])
  );

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file after an error
    if (!file) return;

    setUploadError(null);

    if (!ALLOWED_PHOTO_TYPES[file.type]) {
      setUploadError("Formato no soportado. Usa JPG, PNG o WEBP.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setUploadError("La imagen es muy grande (máx. 5MB).");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (!res.ok) throw new Error();
      const data: { url: string } = await res.json();
      setPhotoUrl(data.url);
    } catch {
      setUploadError("No se pudo subir la foto. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="photoUrl" value={photoUrl} />

      <div className={`${cardBase} flex flex-col gap-5 p-6`}>
        <p className={eyebrow}>Perfil</p>

        <div>
          <label className={labelBase}>Foto</label>
          <div className="flex items-center gap-4">
            {photoUrl && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-secondary/30">
                <Image src={photoUrl} alt="" fill className="object-cover" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className={fileInput}
            />
          </div>
          <p className="mt-1.5 text-xs text-text/45">JPG, PNG o WEBP · máx. 5MB</p>
          {uploading && <p className="mt-1 text-xs text-text/50">Subiendo...</p>}
          {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
        </div>

        <div>
          <label className={labelBase}>Nombre</label>
          <input name="name" defaultValue={provider?.name} className={inputBase} required />
        </div>

        <div>
          <label className={labelBase}>Rol</label>
          <input name="role" defaultValue={provider?.role} className={inputBase} required />
        </div>

        <div>
          <label className={labelBase}>Descripción</label>
          <textarea
            name="bio"
            defaultValue={provider?.bio}
            rows={3}
            className={inputBase}
            required
          />
        </div>

        <div>
          <label className={labelBase}>Correo</label>
          <input
            name="email"
            type="email"
            defaultValue={provider?.email ?? undefined}
            className={inputBase}
          />
          <p className="mt-1.5 text-xs text-text/45">
            Acá le llega el aviso de cada cita nueva que le agendan. No tiene que
            ser el mismo correo del ID de Google Calendar de abajo.
          </p>
        </div>

        <div>
          <label className={labelBase}>ID de Google Calendar</label>
          <input
            name="googleCalendarId"
            defaultValue={provider?.googleCalendarId ?? undefined}
            className={inputBase}
          />
          <p className="mt-1.5 text-xs text-text/45">
            Sin esto, esta persona no se puede reservar en línea — solo aparece en el
            sitio. No siempre coincide con su correo de arriba: si usa un calendario
            dedicado (no el personal), buscá el ID en Google Calendar →
            Configuración de ese calendario → Integrar calendario → &quot;ID de
            calendario&quot;.
          </p>
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

      <fieldset className={`${cardBase} p-6`}>
        <legend className={eyebrow}>Horario</legend>
        <label className="mt-3 flex items-center gap-2 text-sm text-primary">
          <input
            type="checkbox"
            name="customHours"
            checked={hasCustomHours}
            onChange={(e) => setHasCustomHours(e.target.checked)}
          />
          Horario personalizado (si no, usa el horario general del negocio)
        </label>

        {hasCustomHours && (
          <div className="mt-4 flex flex-col gap-2">
            {DAY_KEYS.map((key) => {
              const day = provider?.workingHours?.[key];
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
            <p className="text-xs text-text/50">Deja un día vacío para marcarlo como cerrado.</p>
          </div>
        )}
      </fieldset>

      <fieldset className={`${cardBase} p-6`}>
        <legend className={eyebrow}>Intervalo entre citas</legend>
        <label className="mt-3 flex items-center gap-2 text-sm text-primary">
          <input
            type="checkbox"
            name="customSlotInterval"
            checked={hasCustomSlotInterval}
            onChange={(e) => setHasCustomSlotInterval(e.target.checked)}
          />
          Intervalo personalizado (si no, usa el intervalo general del negocio)
        </label>

        {hasCustomSlotInterval && (
          <div className="mt-4">
            <label className={labelBase}>Minutos entre citas</label>
            <input
              type="number"
              name="slotIntervalMinutes"
              min={5}
              step={5}
              defaultValue={provider?.slotIntervalMinutes ?? ""}
              placeholder="30"
              className={`${inputBase} max-w-[10rem]`}
            />
          </div>
        )}
      </fieldset>

      <div className="flex gap-3">
        <button type="submit" disabled={uploading} className={buttonPrimary}>
          Guardar
        </button>
        <a href="/admin/providers" className={buttonSecondary}>
          Cancelar
        </a>
      </div>
    </form>
  );
}
