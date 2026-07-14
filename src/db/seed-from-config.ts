import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { providers, services, galleryImages, locations, settings } from "./schema";
import { siteConfig } from "../config/site.config";

// One-time helper for migrating an existing business branch's hardcoded
// providers/services/gallery/location/contact (from site.config.ts and
// public/brand/gallery/) into the database, before those are removed from
// the config. Safe to re-run — skips anything that already exists.

function readGalleryImages(): string[] {
  const dir = path.join(process.cwd(), "public", "brand", "gallery");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/brand/gallery/${f}`);
  } catch {
    return [];
  }
}

async function main() {
  const existingProviders = new Set(db.select({ id: providers.id }).from(providers).all().map((r) => r.id));
  const existingServices = new Set(db.select({ id: services.id }).from(services).all().map((r) => r.id));

  const staticConfig = siteConfig as unknown as {
    providers?: (typeof providers.$inferInsert)[];
    services?: (typeof services.$inferInsert)[];
  };

  let insertedProviders = 0;
  for (const provider of staticConfig.providers ?? []) {
    if (existingProviders.has(provider.id)) continue;
    db.insert(providers).values(provider).run();
    insertedProviders++;
  }

  let insertedServices = 0;
  for (const service of staticConfig.services ?? []) {
    if (existingServices.has(service.id)) continue;
    db.insert(services).values(service).run();
    insertedServices++;
  }

  // Gallery: only seed if the table is still empty, keyed by url so re-runs
  // don't duplicate images already imported (or added since via /admin).
  const existingGalleryUrls = new Set(
    db.select({ url: galleryImages.url }).from(galleryImages).all().map((r) => r.url)
  );
  let insertedGalleryImages = 0;
  readGalleryImages().forEach((url, index) => {
    if (existingGalleryUrls.has(url)) return;
    db.insert(galleryImages).values({ id: crypto.randomUUID(), url, sortOrder: index }).run();
    insertedGalleryImages++;
  });

  // Location: only seed if the table is empty — site.config.ts only ever
  // had one address, so there's nothing meaningful to dedupe against.
  let insertedLocations = 0;
  const hasLocations = db.select({ id: locations.id }).from(locations).limit(1).get();
  if (!hasLocations && siteConfig.location) {
    db.insert(locations)
      .values({
        id: crypto.randomUUID(),
        address: siteConfig.location.address,
        mapEmbedUrl: siteConfig.location.mapEmbedUrl,
        sortOrder: 0,
      })
      .run();
    insertedLocations = 1;
  }

  // Settings: single row, upsert. Working hours come from
  // appointments.workingHours (the machine-readable source of truth);
  // the human-readable `schedule` text is derived from it going forward.
  const existingSettings = db.select().from(settings).where(eq(settings.id, "main")).get();
  const settingsValues = {
    workingHours: siteConfig.appointments?.workingHours,
    contactPhone: siteConfig.contact?.phone,
    contactEmail: siteConfig.contact?.email,
    contactSocials: siteConfig.contact?.socials,
  };
  if (existingSettings) {
    db.update(settings).set(settingsValues).where(eq(settings.id, "main")).run();
  } else {
    db.insert(settings).values({ id: "main", ...settingsValues }).run();
  }

  console.log(
    `[db:seed-from-config] Inserted ${insertedProviders} provider(s), ${insertedServices} service(s), ${insertedGalleryImages} gallery image(s), ${insertedLocations} location(s), and seeded settings.`
  );
}

main();
