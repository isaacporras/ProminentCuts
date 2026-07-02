import { siteConfig } from "@/config/site.config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export function Providers() {
  return (
    <section id="barberos" className="relative isolate overflow-hidden bg-primary/5 py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.providers}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionHeading
          title={siteConfig.terminology.providerPlural}
          subtitle="Conoce al equipo que se encargará de tu estilo."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
}
