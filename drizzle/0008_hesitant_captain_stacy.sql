CREATE TABLE "class_materials" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" text NOT NULL,
	"kind" text NOT NULL,
	"url" text,
	"content" text,
	"mime_type" text,
	"filename" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_outcomes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" text NOT NULL,
	"text" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_outline_items" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_subscriptions" (
	"class_id" text NOT NULL,
	"pricing_plan_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_tutors" (
	"class_id" text NOT NULL,
	"tutor_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"cover_image" text,
	"language_id" text NOT NULL,
	"content_type_id" text NOT NULL,
	"media_type_id" text NOT NULL,
	"level_id" text NOT NULL,
	"primary_tutor_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "student_classes" (
	"student_id" text NOT NULL,
	"class_id" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "class_materials" ADD CONSTRAINT "class_materials_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_outcomes" ADD CONSTRAINT "class_outcomes_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_outline_items" ADD CONSTRAINT "class_outline_items_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subscriptions" ADD CONSTRAINT "class_subscriptions_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_subscriptions" ADD CONSTRAINT "class_subscriptions_pricing_plan_id_pricing_plans_id_fk" FOREIGN KEY ("pricing_plan_id") REFERENCES "public"."pricing_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_tutors" ADD CONSTRAINT "class_tutors_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_tutors" ADD CONSTRAINT "class_tutors_tutor_id_user_id_fk" FOREIGN KEY ("tutor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_content_type_id_content_types_id_fk" FOREIGN KEY ("content_type_id") REFERENCES "public"."content_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_media_type_id_media_types_id_fk" FOREIGN KEY ("media_type_id") REFERENCES "public"."media_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_primary_tutor_id_user_id_fk" FOREIGN KEY ("primary_tutor_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_classes" ADD CONSTRAINT "student_classes_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "class_materials_class_idx" ON "class_materials" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "class_outcomes_class_idx" ON "class_outcomes" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "class_outline_class_idx" ON "class_outline_items" USING btree ("class_id");--> statement-breakpoint
CREATE UNIQUE INDEX "class_subscriptions_pair_unique" ON "class_subscriptions" USING btree ("class_id","pricing_plan_id");--> statement-breakpoint
CREATE INDEX "class_subscriptions_plan_idx" ON "class_subscriptions" USING btree ("pricing_plan_id");--> statement-breakpoint
CREATE UNIQUE INDEX "class_tutors_pair_unique" ON "class_tutors" USING btree ("class_id","tutor_id");--> statement-breakpoint
CREATE INDEX "class_tutors_tutor_idx" ON "class_tutors" USING btree ("tutor_id");--> statement-breakpoint
CREATE INDEX "classes_status_idx" ON "classes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "classes_language_idx" ON "classes" USING btree ("language_id");--> statement-breakpoint
CREATE INDEX "classes_primary_tutor_idx" ON "classes" USING btree ("primary_tutor_id");--> statement-breakpoint
CREATE UNIQUE INDEX "student_classes_pair_unique" ON "student_classes" USING btree ("student_id","class_id");--> statement-breakpoint
CREATE INDEX "student_classes_class_idx" ON "student_classes" USING btree ("class_id");
--> statement-breakpoint
INSERT INTO "user" ("id", "name", "email", "email_verified", "username", "display_username", "subscription", "role", "banned")
VALUES ('correct-student-platform-tutor', 'Correct Student tutor', 'platform-tutor@correct-student.invalid', true, 'correct-student-tutor', 'Correct Student tutor', 'free', 'tutor', false)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
CREATE FUNCTION protect_platform_tutor() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.id = 'correct-student-platform-tutor' THEN
      RAISE EXCEPTION 'The platform tutor cannot be deleted';
    END IF;
    RETURN OLD;
  END IF;
  IF OLD.id = 'correct-student-platform-tutor' AND (NEW.id <> OLD.id OR NEW.role <> 'tutor') THEN
    RAISE EXCEPTION 'The platform tutor identity and role cannot change';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER protect_platform_tutor_update BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION protect_platform_tutor();
--> statement-breakpoint
CREATE TRIGGER protect_platform_tutor_delete BEFORE DELETE ON "user" FOR EACH ROW EXECUTE FUNCTION protect_platform_tutor();
