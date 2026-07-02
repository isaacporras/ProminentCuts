import Image from "next/image";
import type { SectionBackground } from "@/types/site-config";

interface SectionBackdropProps {
  background?: SectionBackground;
  /** Overlay color used when `background.color` is not defined. */
  defaultOverlayColor?: string;
  /** Overlay opacity over the image (0-1). */
  overlayOpacity?: number;
  /** Mark image as priority (use only for the above-the-fold section, e.g. Hero). */
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
