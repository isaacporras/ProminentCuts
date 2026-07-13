import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { services as servicesTable } from "@/db/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export async function Services() {
  const services = db.select().from(servicesTable).all();

  return (
    <section id="servicios" className="relative overflow-hidden bg-bg py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.services}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          title={siteConfig.terminology.servicePlural}
          subtitle={siteConfig.servicesSubtitle}
        />
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="w-full flex-none sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
