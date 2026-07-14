import Image from "next/image";
import { db } from "@/db/client";
import { galleryImages } from "@/db/schema";
import { addGalleryImage, deleteGalleryImage, moveGalleryImage } from "./actions";
import { GalleryUploadButton } from "./GalleryUploadButton";
import { DeleteButton } from "../DeleteButton";
import { MAX_GALLERY_IMAGES } from "@/lib/limits";
import { cardBase, eyebrow, pageHeading, buttonIcon } from "../../ui";

export default async function AdminGalleryPage() {
  const images = db.select().from(galleryImages).orderBy(galleryImages.sortOrder).all();

  return (
    <div>
      <p className={eyebrow}>Panel</p>
      <h1 className={pageHeading}>Galería</h1>
      <p className="mt-1 text-sm text-text/45">
        {images.length} de {MAX_GALLERY_IMAGES} imágenes
      </p>

      <div className={`${cardBase} mt-6 mb-8 p-6`}>
        <GalleryUploadButton
          addAction={addGalleryImage}
          atLimit={images.length >= MAX_GALLERY_IMAGES}
          limit={MAX_GALLERY_IMAGES}
        />
      </div>

      {images.length === 0 ? (
        <div className={`${cardBase} px-6 py-10 text-center`}>
          <p className="text-sm text-text/55">Todavía no hay imágenes en la galería.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, i) => (
            <div key={image.id} className={`${cardBase} overflow-hidden`}>
              <div className="relative aspect-square bg-primary/5">
                <Image src={image.url} alt="" fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <div className="flex gap-1">
                  <form action={moveGalleryImage.bind(null, image.id, "up")}>
                    <button type="submit" disabled={i === 0} className={buttonIcon} aria-label="Mover antes">
                      ↑
                    </button>
                  </form>
                  <form action={moveGalleryImage.bind(null, image.id, "down")}>
                    <button
                      type="submit"
                      disabled={i === images.length - 1}
                      className={buttonIcon}
                      aria-label="Mover después"
                    >
                      ↓
                    </button>
                  </form>
                </div>
                <DeleteButton action={deleteGalleryImage.bind(null, image.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
