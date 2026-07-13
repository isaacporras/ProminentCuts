import { config } from "dotenv";

// Next.js loads .env.local automatically; this standalone script doesn't,
// so it needs to load it itself before ./client reads DATABASE_PATH etc.
config({ path: ".env.local", quiet: true });

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { adminUsers, providers, services } from "./schema";
import { hashPassword } from "../lib/auth";
import { siteConfig } from "../config/site.config";

async function seedAdminUser() {
  const username = process.env.ADMIN_INITIAL_USER;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!username || !password) {
    console.warn(
      "[db:migrate] ADMIN_INITIAL_USER/ADMIN_INITIAL_PASSWORD not set — skipping admin seed."
    );
    return;
  }

  const existing = db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .get();
  if (existing) return;

  db.insert(adminUsers)
    .values({
      id: crypto.randomUUID(),
      username,
      passwordHash: await hashPassword(password),
      updatedAt: new Date(),
    })
    .run();
  console.log(`[db:migrate] Seeded admin user "${username}".`);
}

// One-time-per-row import of a business branch's legacy hardcoded
// providers/services (site.config.ts) into the database. Runs on every
// boot but is idempotent — skips ids already present — so it's safe to
// leave running until whoever owns that branch deletes the arrays.
function seedFromStaticConfig() {
  let insertedProviders = 0;
  for (const provider of siteConfig.providers ?? []) {
    const existing = db.select().from(providers).where(eq(providers.id, provider.id)).get();
    if (existing) continue;
    db.insert(providers).values(provider).run();
    insertedProviders++;
  }

  let insertedServices = 0;
  for (const service of siteConfig.services ?? []) {
    const existing = db.select().from(services).where(eq(services.id, service.id)).get();
    if (existing) continue;
    db.insert(services).values(service).run();
    insertedServices++;
  }

  if (insertedProviders || insertedServices) {
    console.log(
      `[db:migrate] Seeded ${insertedProviders} provider(s) and ${insertedServices} service(s) from site.config.ts.`
    );
  }
}

async function main() {
  migrate(db, { migrationsFolder: "./drizzle" });
  await seedAdminUser();
  seedFromStaticConfig();
  console.log("[db:migrate] Done.");
}

main();
