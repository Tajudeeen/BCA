CREATE TABLE `blog_posts` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`category` text NOT NULL,
	`cover` text DEFAULT '' NOT NULL,
	`cover_alt` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
