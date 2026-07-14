import { MapPin } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export function Location() {
  const rows = db.select().from(locations).orderBy(locations.sortOrder).all();
  if (!rows.length) return null;

  return (
    <section id="ubicacion" className="relative overflow-hidden bg-bg py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.location}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading title={rows.length > 1 ? "Ubicaciones" : "Ubicación"} />
        <div className="flex flex-col gap-8">
          {rows.map((location) => (
            <div key={location.id} className="grid gap-8 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-secondary" />
                <p className="text-text/80">{location.address}</p>
              </div>
              {location.mapEmbedUrl ? (
                <iframe
                  src={location.mapEmbedUrl}
                  className="h-64 w-full rounded-xl border border-primary/10 sm:h-full"
                  loading="lazy"
                  title={`Mapa de ${location.address}`}
                />
              ) : (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-primary/20 text-sm text-text/50 sm:h-full">
                  Mapa no configurado
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
