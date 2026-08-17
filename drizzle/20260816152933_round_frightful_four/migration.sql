ALTER TABLE "products"
ALTER COLUMN "tags"
SET DATA TYPE varchar[]
USING CASE
  WHEN "tags" IS NULL THEN NULL
  ELSE regexp_split_to_array("tags", '\s*,\s*')::varchar[]
END;
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "tags" DROP DEFAULT;