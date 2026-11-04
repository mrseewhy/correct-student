-- Content types: songs, stories, lessons
CREATE TABLE "content_types" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_types_name_unique" UNIQUE("name")
);
CREATE INDEX "content_types_name_idx" ON "content_types" ("name");

-- Media types: video, text, audio
CREATE TABLE "media_types" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_types_name_unique" UNIQUE("name")
);
CREATE INDEX "media_types_name_idx" ON "media_types" ("name");

-- Levels: beginners, intermediate, advanced
CREATE TABLE "levels" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "levels_name_unique" UNIQUE("name")
);
CREATE INDEX "levels_name_idx" ON "levels" ("name");

-- Media uploads
CREATE TABLE "media" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"url" text NOT NULL,
	"media_type" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "media_media_type_idx" ON "media" ("media_type");
CREATE INDEX "media_uploaded_at_idx" ON "media" ("uploaded_at");
