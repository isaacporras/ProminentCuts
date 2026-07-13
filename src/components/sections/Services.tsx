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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
