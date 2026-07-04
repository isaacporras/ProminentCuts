"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Image from "next/image";

export function GalleryCarousel({ images }: { images: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  // Duplicated so the CSS animation can loop seamlessly from -50%.
  const loopImages = [...images, ...images];

  const lightbox = selected && (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelected(null);
      }}
    >
      <button
        type="button"
        onClick={() => setSelected(null)}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10"
        aria-label="Cerrar"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="relative h-full max-h-[85vh] w-full max-w-4xl">
        <Image
          src={selected}
          alt="Foto ampliada"
          fill
          className="object-contain"
          sizes="90vw"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="overflow-hidden">
        <div
          className="flex w-max animate-marquee gap-3"
          style={{ animationDuration: `${images.length * 6}s` }}
        >
          {loopImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setSelected(src)}
              className="relative aspect-[3/4] w-56 shrink-0 overflow-hidden rounded-2xl bg-primary/5 shadow-sm transition hover:scale-[1.02] sm:w-64"
              aria-label="Ampliar foto"
            >
              <Image
                src={src}
                alt={`Foto ${(i % images.length) + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 224px, 256px"
              />
            </button>
          ))}
        </div>
      </div>

      {mounted && createPortal(lightbox, document.body)}
    </>
  );
}
