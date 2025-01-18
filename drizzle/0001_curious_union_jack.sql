CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`account` text NOT NULL,
	`pw` text NOT NULL,
	`logo` text NOT NULL,
	`note` text NOT NULL
);
--> statement-breakpoint
DROP TABLE `accountInfo`;