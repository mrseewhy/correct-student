ALTER TABLE "classes" ADD COLUMN "created_by_id" text;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
UPDATE "classes" SET "created_by_id" = "primary_tutor_id" WHERE "created_by_id" IS NULL;
