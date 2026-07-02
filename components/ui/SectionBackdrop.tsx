import Image from "next/image";
import type { SectionBackground } from "@/types/site-config";

interface SectionBackdropProps {
  background?: SectionBackground;
  /** Tinte usado sobre la imagen cuando `background.color` no está definido. */
  defaultOverlayColor?: string;
  /** Opacidad del tinte sobre la imagen (0-1). */
  overlayOpacity?: number;
  /** Marca la imagen como prioritaria (usar solo en la sección visible al cargar, ej. Hero). */
  priority?: boolean;
}

export function SectionBackdrop({
  background,
  defaultOverlayColor = "#fafaf9",
  overlayOpacity = 0.88,
  priority = false,
}: SectionBackdropProps) {
  if (!background?.image && !background?.color) return null;

  if (background.image) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={background.image}
          alt=""
          fill
          priority={priority}
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: background.color ?? defaultOverlayColor,
            opacity: overlayOpacity,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 -z-10"
      style={{ backgroundColor: background.color }}
    />
  );
}
