import { eq } from "drizzle-orm";
import { siteConfig } from "@/config/site.config";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  const row = db.select().from(settings).where(eq(settings.id, "main")).get();
  const socials = row?.contactSocials ?? siteConfig.contact.socials;

  return (
    <footer className="border-t border-primary/10 bg-primary py-8 text-bg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading font-semibold">{siteConfig.business.name}</p>
          <p className="text-sm text-bg/70">{siteConfig.business.tagline}</p>
        </div>
        <SocialLinks socials={socials} linkClassName="text-bg/80 hover:text-secondary" />
      </div>
      <p className="mt-6 text-center text-xs text-bg/50">
        © {new Date().getFullYear()} {siteConfig.business.name}. Todos los derechos reservados.
      </p>
    </footer>
  );
}
