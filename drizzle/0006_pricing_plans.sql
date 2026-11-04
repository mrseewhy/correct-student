CREATE TABLE "pricing_plans" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_key" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price_ngn" integer DEFAULT 0 NOT NULL,
	"price_usd" integer DEFAULT 0 NOT NULL,
	"price_gbp" integer DEFAULT 0 NOT NULL,
	"features" text[] DEFAULT '{}'::text[] NOT NULL,
	"cta" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pricing_plans_plan_key_unique" UNIQUE("plan_key"),
	CONSTRAINT "pricing_plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX "pricing_plans_price_ngn_idx" ON "pricing_plans" USING btree ("price_ngn");
--> statement-breakpoint
-- Seeds the catalog with the exact plans from the former static list
-- (lib/pricing.ts), so the pricing page and admin section keep the same
-- content while becoming editable.
INSERT INTO "pricing_plans" ("plan_key", "name", "description", "price_ngn", "price_usd", "price_gbp", "features", "cta", "featured") VALUES
('free', 'Free', 'A little curiosity. A whole new language.', 0, 0, 0, '{"Introductory language lessons","A taste of our stories and songs","Learn at your own pace","Access on any device"}', 'Start for free', false),
('starter', 'Starter', 'Build a happy, everyday learning habit.', 5000, 5, 4, '{"Everything in Free","Full lessons in one language","More stories and sing-along songs","Practice activities and quizzes","Track your learning progress"}', 'Choose Starter', false),
('plus', 'Plus', 'More ways to learn. More reasons to smile.', 10000, 10, 8, '{"Everything in Starter","Explore all four African languages","The complete story and song library","Personalized practice activities","Downloadable learning worksheets","Priority support"}', 'Choose Plus', true),
('premium', 'Premium', 'A helping hand for every big breakthrough.', 25000, 25, 20, '{"Everything in Plus","Two one-on-one classes each month","Guidance from an expert teacher","A personal learning plan","Class feedback and progress updates","Flexible class scheduling"}', 'Choose Premium', false);