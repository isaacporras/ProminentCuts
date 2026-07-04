import Image from "next/image";
import type { ProviderItem } from "@/types/site-config";
import { SocialLinks } from "./SocialLinks";

export function ProviderCard({ provider }: { provider: ProviderItem }) {
  const initials = provider.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="overflow-hidden rounded-xl border border-primary/10 bg-bg shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square w-full bg-primary/5">
        {provider.photoUrl ? (
          <Image
            src={provider.photoUrl}
            alt={provider.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-bold text-primary/25">{initials}</span>
          </div>
        )}
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
