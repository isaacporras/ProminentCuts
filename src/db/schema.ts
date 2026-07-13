import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { SocialLink, WorkingHoursConfig } from "@/types/site-config";

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const providers = sqliteTable("providers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url"),
  googleCalendarId: text("google_calendar_id"),
  socials: text("socials", { mode: "json" }).$type<SocialLink[]>(),
  // Provider-specific schedule override. Null falls back to
  // siteConfig.appointments.workingHours.
  workingHours: text("working_hours", { mode: "json" }).$type<WorkingHoursConfig>(),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price"),
  durationMinutes: integer("duration_minutes"),
});
