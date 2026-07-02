import Image from "next/image";
import type { ProviderItem } from "@/types/site-config";
import { SocialLinks } from "./SocialLinks";

export function ProviderCard({ provider }: { provider: ProviderItem }) {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/10 bg-bg shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square w-full bg-primary/5">
        <Image
          src={provider.photoUrl}
          alt={provider.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-primary">{provider.name}</h3>
        <p className="text-sm font-medium text-secondary">{provider.role}</p>
        <p className="mt-2 text-sm text-text/70">{provider.bio}</p>
        {provider.socials && provider.socials.length > 0 && (
          <SocialLinks socials={provider.socials} className="mt-4" />
        )}
      </div>
    </div>
  );
}
