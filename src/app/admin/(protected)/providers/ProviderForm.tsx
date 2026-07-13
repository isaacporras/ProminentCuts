"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProviderItem, SocialPlatform } from "@/types/site-config";
import { inputBase, labelBase, buttonPrimary, buttonSecondary } from "../../ui";

const SOCIAL_FIELDS: { platform: SocialPlatform; label: string }[] = [
  { platform: "instagram", label: "Instagram" },
  { platform: "tiktok", label: "TikTok" },
  { platform: "facebook", label: "Facebook" },
  { platform: "x", label: "X" },
  { platform: "whatsapp", label: "WhatsApp" },
];

const DAYS: { key: string; label: string }[] = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
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

  const socialsByPlatform = Object.fromEntries(
    (provider?.socials ?? []).map((s) => [s.platform, s.url])
  );

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
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

      <div>
        <label className={labelBase}>Foto</label>
        <div className="flex items-center gap-4">
          {photoUrl && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-primary/10">
              <Image src={photoUrl} alt="" fill className="object-cover" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
        </div>
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
        <label className={labelBase}>ID de Google Calendar (opcional — déjalo vacío si no es reservable en línea)</label>
        <input
          name="googleCalendarId"
          defaultValue={provider?.googleCalendarId ?? undefined}
          className={inputBase}
          placeholder="nombre@gmail.com"
        />
      </div>

      <fieldset>
        <legend className={labelBase}>Redes sociales (opcional)</legend>
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

      <fieldset>
        <label className="flex items-center gap-2 text-sm text-primary">
          <input
            type="checkbox"
            name="customHours"
            checked={hasCustomHours}
            onChange={(e) => setHasCustomHours(e.target.checked)}
          />
          Horario personalizado (si no, usa el horario general del negocio)
        </label>

        {hasCustomHours && (
          <div className="mt-3 flex flex-col gap-2">
            {DAYS.map(({ key, label }) => {
              const day = provider?.workingHours?.[key as keyof typeof provider.workingHours];
              return (
                <div key={key} className="grid grid-cols-3 items-center gap-2">
                  <span className="text-sm text-text/70">{label}</span>
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
