import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

import { db } from "./client";
import { providers, services } from "./schema";
import { siteConfig } from "../config/site.config";

// One-time helper for migrating an existing business branch's hardcoded
// providers/services (from site.config.ts) into the database, before
// those arrays are removed from the config. Safe to re-run — skips ids
// that already exist.

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

  console.log(
    `[db:seed-from-config] Inserted ${insertedProviders} provider(s) and ${insertedServices} service(s).`
  );
}

main();
