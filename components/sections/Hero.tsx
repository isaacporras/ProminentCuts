import { siteConfig } from "@/config/site.config";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export function Hero() {
  return (
    <section id="acerca" className="relative isolate overflow-hidden bg-primary py-24 text-bg">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.hero}
        defaultOverlayColor={siteConfig.theme.primary}
        overlayOpacity={0.45}
        priority
      />
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
          {siteConfig.business.tagline}
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          {siteConfig.hero.headline}
        </h1>
        <p className="mt-5 text-lg text-bg/80">{siteConfig.hero.subheadline}</p>
        <p className="mx-auto mt-6 max-w-2xl text-sm text-bg/60">
          {siteConfig.business.description}
        </p>
        <div className="mt-8">
          <CTAButton href={siteConfig.hero.ctaHref} label={siteConfig.hero.ctaLabel} />
        </div>
      </div>
    </section>
  );
}
