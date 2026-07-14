CREATE TABLE `gallery_images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`address` text NOT NULL,
	`map_embed_url` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`working_hours` text,
	`contact_phone` text,
	`contact_email` text,
	`contact_socials` text
);
