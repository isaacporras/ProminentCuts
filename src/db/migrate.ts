import { config } from "dotenv";

// Next.js loads .env.local automatically; this standalone script doesn't,
// so it needs to load it itself before ./client reads DATABASE_PATH etc.
config({ path: ".env.local", quiet: true });

import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { adminUsers } from "./schema";
import { hashPassword } from "../lib/auth";

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

async function main() {
  migrate(db, { migrationsFolder: "./drizzle" });
  await seedAdminUser();
  console.log("[db:migrate] Done.");
}

main();
