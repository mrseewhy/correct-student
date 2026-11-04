ALTER TABLE "languages" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
-- Keep existing rows identifying correctly: each old public_id becomes the record's id.
ALTER TABLE "languages" ALTER COLUMN "id" SET DATA TYPE text USING "public_id"::text;--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "languages" DROP COLUMN "public_id";
