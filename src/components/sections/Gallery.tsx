import fs from "fs";
import path from "path";
import { siteConfig } from "@/config/site.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryCarousel } from "@/components/sections/GalleryCarousel";

function readGalleryImages(): string[] {
  const dir = path.join(process.cwd(), "public", "brand", "gallery");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/brand/gallery/${f}`);
  } catch {
    return [];
  }
}

export function Gallery() {
  if (!siteConfig.gallery) return null;

  const images = readGalleryImages();
  if (!images.length) return null;

  const { title = "Galería", subtitle } = siteConfig.gallery;

  return (
    <section id="galeria" className="relative overflow-hidden bg-bg py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title={title} subtitle={subtitle} />
        <GalleryCarousel images={images} />
      </div>
    </section>
  );
}
