import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { providers as providersTable } from "@/db/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export async function Providers() {
  const providers = db.select().from(providersTable).all();

  return (
    <section id="equipo" className="relative overflow-hidden bg-primary/5 py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.providers}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          title={siteConfig.terminology.providerPlural}
          subtitle={siteConfig.providersSubtitle}
        />
        <div className="flex flex-wrap justify-center gap-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="w-full flex-none sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <ProviderCard provider={provider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
