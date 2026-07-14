import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { galleryImages } from "@/db/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryCarousel } from "@/components/sections/GalleryCarousel";

export function Gallery() {
  if (!siteConfig.gallery) return null;

  const images = db.select().from(galleryImages).orderBy(galleryImages.sortOrder).all();
  if (!images.length) return null;

  const { title = "Galería", subtitle } = siteConfig.gallery;

  return (
    <section id="galeria" className="relative overflow-hidden bg-bg py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title={title} subtitle={subtitle} />
        <GalleryCarousel images={images.map((i) => i.url)} />
      </div>
    </section>
  );
}
