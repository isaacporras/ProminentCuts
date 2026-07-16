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
  email: text("email"),
  googleCalendarId: text("google_calendar_id"),
  socials: text("socials", { mode: "json" }).$type<SocialLink[]>(),
  // Provider-specific schedule override. Null falls back to
  // siteConfig.appointments.workingHours.
  workingHours: text("working_hours", { mode: "json" }).$type<WorkingHoursConfig>(),
  // Provider-specific minimum interval between appointment start times, in
  // minutes. Null falls back to the business-wide value in `settings`.
  slotIntervalMinutes: integer("slot_interval_minutes"),
});

export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price"),
  durationMinutes: integer("duration_minutes"),
});

export const galleryImages = sqliteTable("gallery_images", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey(),
  address: text("address").notNull(),
  mapEmbedUrl: text("map_embed_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// Single-row table: business-wide settings that aren't a list of anything
// (schedule, contact info). Always operate on the row with id = "main".
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  workingHours: text("working_hours", { mode: "json" }).$type<WorkingHoursConfig>(),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  contactSocials: text("contact_socials", { mode: "json" }).$type<SocialLink[]>(),
  // Business-wide minimum interval between appointment start times, in
  // minutes. Null falls back to DEFAULT_SLOT_INTERVAL_MINUTES.
  slotIntervalMinutes: integer("slot_interval_minutes"),
});
