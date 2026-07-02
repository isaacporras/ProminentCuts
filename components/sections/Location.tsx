import { MapPin } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export function Location() {
  const { location } = siteConfig;

  return (
    <section id="ubicacion" className="relative isolate overflow-hidden bg-bg py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.location}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <SectionHeading title="Ubicación" />
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-secondary" />
              <p className="text-text/80">{location.address}</p>
            </div>
            <div className="mt-6 divide-y divide-primary/10 rounded-xl border border-primary/10">
              {location.schedule.map((entry) => (
                <div key={entry.day} className="flex justify-between px-5 py-3 text-sm">
                  <span className="font-medium text-primary">{entry.day}</span>
                  <span className="text-text/70">{entry.hours}</span>
                </div>
              ))}
            </div>
          </div>
          {location.mapEmbedUrl ? (
            <iframe
              src={location.mapEmbedUrl}
              className="h-64 w-full rounded-xl border border-primary/10 sm:h-full"
              loading="lazy"
              title="Mapa de ubicación"
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-primary/20 text-sm text-text/50 sm:h-full">
              Mapa no configurado
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
