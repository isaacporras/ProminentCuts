import type { SVGProps } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/ui/icons/brand-icons";
import type { SocialLink, SocialPlatform } from "@/types/site-config";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialPlatform, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
  whatsapp: WhatsAppIcon,
  x: XIcon,
};

interface SocialLinksProps {
  socials: SocialLink[];
  className?: string;
  iconClassName?: string;
  linkClassName?: string;
}

export function SocialLinks({ socials, className, iconClassName, linkClassName }: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {socials.map((social) => {
        const Icon = ICONS[social.platform];
        return (
          <a
            key={social.platform + social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className={cn("text-text/70 transition hover:text-secondary", linkClassName)}
          >
            <Icon className={cn("h-5 w-5", iconClassName)} />
          </a>
        );
      })}
    </div>
  );
}
