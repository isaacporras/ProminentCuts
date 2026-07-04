"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site.config";
import type { ProviderItem } from "@/types/site-config";

interface StepSelectProviderProps {
  selected: ProviderItem | null;
  onSelect: (provider: ProviderItem) => void;
}

export function StepSelectProvider({ selected, onSelect }: StepSelectProviderProps) {
  const bookableProviders = siteConfig.providers.filter((p) => p.googleCalendarId);

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-primary">Elige tu barbero</h2>
      <p className="mb-6 text-sm text-text/60">¿Con quién te gustaría reservar?</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookableProviders.map((provider) => {
          const initials = provider.name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => onSelect(provider)}
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition hover:border-secondary",
                selected?.id === provider.id
                  ? "border-secondary bg-secondary/5"
                  : "border-primary/10 bg-bg"
              )}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-primary/10">
                {provider.photoUrl ? (
                  <Image src={provider.photoUrl} alt={provider.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm font-bold text-primary/40">{initials}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-primary">{provider.name}</p>
                <p className="text-xs text-secondary">{provider.role}</p>
                <p className="mt-0.5 text-xs text-text/60 line-clamp-2">{provider.bio}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
