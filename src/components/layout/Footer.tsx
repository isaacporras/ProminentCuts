import { siteConfig } from "@/config/site.config";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary py-8 text-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading font-semibold">{siteConfig.business.name}</p>
          <p className="text-sm text-bg/70">{siteConfig.business.tagline}</p>
        </div>
        <SocialLinks
          socials={siteConfig.contact.socials}
          linkClassName="text-bg/80 hover:text-secondary"
        />
      </div>
      <p className="mt-6 text-center text-xs text-bg/50">
        © {new Date().getFullYear()} {siteConfig.business.name}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
