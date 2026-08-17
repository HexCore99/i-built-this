DELETE FROM "votes";--> statement-breakpoint
DELETE FROM "products";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_submitted_by_users_id_fkey";--> statement-breakpoint
ALTER TABLE "votes" DROP CONSTRAINT "votes_user_id_users_id_fkey";--> statement-breakpoint
DROP TABLE "organizations";--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "organization_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "submitted_by" SET DATA TYPE varchar(255) USING "submitted_by"::varchar(255);--> statement-breakpoint
ALTER TABLE "votes" ALTER COLUMN "user_id" SET DATA TYPE varchar(255) USING "user_id"::varchar(255);
