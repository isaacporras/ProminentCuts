"use client";

import { useState } from "react";
import { fileInput } from "../../ui";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB — debe coincidir con /api/admin/upload/gallery
const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
};

interface GalleryUploadButtonProps {
  addAction: (url: string) => Promise<{ error?: string }>;
  atLimit: boolean;
  limit: number;
}

export function GalleryUploadButton({ addAction, atLimit, limit }: GalleryUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file after an error
    if (!file) return;

    setError(null);

    if (!ALLOWED_PHOTO_TYPES[file.type]) {
      setError("Formato no soportado. Usa JPG, PNG o WEBP.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("La imagen es muy grande (máx. 5MB).");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload/gallery", { method: "POST", body });
      if (!res.ok) throw new Error();
      const data: { url: string } = await res.json();
      const result = await addAction(data.url);
      if (result.error) setError(result.error);
    } catch {
      setError("No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  if (atLimit) {
    return (
      <p className="text-sm text-text/55">
        Llegaste al máximo de {limit} imágenes. Borrá una para poder subir otra.
      </p>
    );
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className={fileInput}
      />
      <p className="mt-1.5 text-xs text-text/45">JPG, PNG o WEBP · máx. 5MB</p>
      {uploading && <p className="mt-1 text-xs text-text/50">Subiendo...</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
