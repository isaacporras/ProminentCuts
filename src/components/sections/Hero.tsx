import { siteConfig } from "@/config/site.config";
import { CTAButton } from "@/components/ui/CTAButton";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export function Hero() {
  return (
    <section id="acerca" className="relative overflow-hidden bg-primary py-24 text-bg">
      {/*
        On mobile the text stack (tagline+headline+subheadline+description) makes
        this section much taller than it is wide. Letting the backdrop stretch to
        that full height (old behavior) forced object-cover to zoom a wide/landscape
        photo way in to fill a narrow/tall box. Capping the image band to a saner
        aspect ratio on mobile keeps the crop reasonable — but the image (tinted at
        45%) and the solid bg-primary below it read as two different-looking blocks
        if primary is a strong/dark color, since the overlay never reaches full
        opacity. The gradient below fades the band into bg-primary instead of
        cutting straight to it.
      */}
      <div className="absolute inset-x-0 top-0 aspect-[4/3] overflow-hidden sm:inset-0 sm:aspect-auto">
        <SectionBackdrop
          background={siteConfig.sectionBackgrounds?.hero}
          defaultOverlayColor={siteConfig.theme.primary}
          overlayOpacity={0.45}
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-b from-transparent to-primary sm:hidden" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
          {siteConfig.business.tagline}
        </p>
        <h1 className="font-heading mt-3 text-4xl font-bold sm:text-5xl">
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
