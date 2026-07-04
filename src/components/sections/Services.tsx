import { siteConfig } from "@/config/site.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export function Services() {
  return (
    <section id="servicios" className="relative overflow-hidden bg-bg py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.services}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          title={siteConfig.terminology.servicePlural}
          subtitle="Todo lo que ofrecemos para que te veas y te sientas mejor."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
