CREATE TABLE "newsletter_subscriptions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "newsletter_subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'subscribed' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"identifier" text NOT NULL,
	"action" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscriptions_email_unique" ON "newsletter_subscriptions" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "rate_limits_identifier_action_unique" ON "rate_limits" USING btree ("identifier","action");--> statement-breakpoint
CREATE INDEX "rate_limits_expires_at_idx" ON "rate_limits" USING btree ("expires_at");