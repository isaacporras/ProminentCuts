import { Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { buildWhatsAppLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

export function Contact() {
  const { contact } = siteConfig;
  const whatsappHref = buildWhatsAppLink(contact.phone, "Hola, tengo una consulta.");

  return (
    <section id="contacto" className="relative overflow-hidden bg-bg py-20">
      <SectionBackdrop
        background={siteConfig.sectionBackgrounds?.contact}
        defaultOverlayColor={siteConfig.theme.background}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <SectionHeading title="Contacto" subtitle="¿Tienes dudas? Escríbenos o síguenos en redes." />
        <div className="flex flex-col items-center gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text/80 transition hover:text-secondary"
          >
            <Phone className="h-4 w-4" /> {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 text-text/80 transition hover:text-secondary"
          >
            <Mail className="h-4 w-4" /> {contact.email}
          </a>
          <SocialLinks socials={contact.socials} className="mt-2" />
        </div>
      </div>
    </section>
  );
}
