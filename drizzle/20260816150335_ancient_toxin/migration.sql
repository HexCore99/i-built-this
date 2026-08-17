CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL UNIQUE,
	"tagline" varchar(255),
	"description" text,
	"website_url" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"tags" varchar(255),
	"vote_count" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"submitted_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"joined_date" date DEFAULT now() NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" serial PRIMARY KEY,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"vote_type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_product_vote" ON "votes" ("user_id","product_id");--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_submitted_by_users_id_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id");