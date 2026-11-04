import {
  bigint,
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Better Auth tables
// Docs: https://better-auth.com/docs/concepts/database
// ---------------------------------------------------------------------------

// Closed, evergreen role set. Self-service signup can only write
// "student" / "tutor" (enforced in lib/auth/index.ts); "admin" and
// "super-admin" are only assigned by a super-admin.
export type AuthRole = "student" | "tutor" | "admin" | "super-admin";
export type SubscriptionPlan = "free" | "starter" | "plus" | "premium";

export const userTable = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    username: text("username").notNull(),
    displayUsername: text("display_username"),
    subscription: text("subscription", {
      enum: ["free", "starter", "plus", "premium"] as [SubscriptionPlan, ...SubscriptionPlan[]],
    }).notNull().default("free"),
    role: text("role", {
      enum: ["student", "tutor", "admin", "super-admin"] as [AuthRole, ...AuthRole[]],
    }).notNull().default("student"),
    // Admin plugin fields
    banned: boolean("banned").notNull().default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_email_unique").on(table.email),
    uniqueIndex("user_username_unique").on(table.username),
  ],
);

export const sessionTable = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    impersonatedBy: text("impersonated_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    uniqueIndex("session_token_unique").on(table.token),
  ],
);

export const accountTable = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verificationTable = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("verification_value_unique").on(table.value)],
);

export const newsletterSubscriptionsTable = pgTable("newsletter_subscriptions", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).notNull().defaultNow(),
  status: text("status", { enum: ["subscribed", "unsubscribed"] }).notNull().default("subscribed"),
}, (table) => [uniqueIndex("newsletter_subscriptions_email_unique").on(table.email)]);

export const contactMessagesTable = pgTable("contact_messages", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("contact_messages_submitted_at_idx").on(table.submittedAt)]);

export const rateLimitsTable = pgTable("rate_limits", {
  identifier: text("identifier").notNull(),
  action: text("action").notNull(),
  count: integer("count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, (table) => [
  uniqueIndex("rate_limits_identifier_action_unique").on(table.identifier, table.action),
  index("rate_limits_expires_at_idx").on(table.expiresAt),
]);

// ---------------------------------------------------------------------------
// Class content types: songs, stories, lessons
// ---------------------------------------------------------------------------
export const contentTypesTable = pgTable("content_types", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("content_types_name_idx").on(table.name),
]);

// ---------------------------------------------------------------------------
// Media types: video, text, audio
// ---------------------------------------------------------------------------
export const mediaTypesTable = pgTable("media_types", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("media_types_name_idx").on(table.name),
]);

// ---------------------------------------------------------------------------
// Learning levels: beginners, intermediate, advanced
// ---------------------------------------------------------------------------
export const levelsTable = pgTable("levels", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("levels_name_idx").on(table.name),
]);

// ---------------------------------------------------------------------------
// Languages: Yoruba, Igbo, Hausa, Fulani
// ---------------------------------------------------------------------------
export const languagesTable = pgTable(
  "languages",
  {
    // Same uuid primary-key pattern as the other content tables, so every
    // admin record exposes a single `id`.
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text("name").notNull().unique(),
    code: text("code").notNull().unique(),
    is_active: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("languages_code_idx").on(table.code),
    index("languages_is_active_idx").on(table.is_active),
  ],
);

// ---------------------------------------------------------------------------
// Subscription plans: the catalog priced on the public pricing page and
// managed in the admin Subscriptions section. `planKey` is the stable id a
// student references from `user.subscription` (see SubscriptionPlan above);
// prices are integer minor units of each supported currency, and `features`
// lists the benefits shown under a plan card's "What's included".
// ---------------------------------------------------------------------------
export const pricingPlansTable = pgTable(
  "pricing_plans",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    planKey: text("plan_key").notNull().unique(),
    name: text("name").notNull().unique(),
    description: text("description").notNull(),
    priceNgn: integer("price_ngn").notNull().default(0),
    priceUsd: integer("price_usd").notNull().default(0),
    priceGbp: integer("price_gbp").notNull().default(0),
    features: text("features").array().notNull().default(sql`'{}'::text[]`),
    cta: text("cta").notNull(),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("pricing_plans_price_ngn_idx").on(table.priceNgn),
  ],
);

// ---------------------------------------------------------------------------
// Media uploads (Cloudinary URLs stored here; provider integration later)
// ---------------------------------------------------------------------------
export const mediaTable = pgTable("media", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mediaType: text("media_type", { enum: ["video", "text", "audio"] }).notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("media_media_type_idx").on(table.mediaType),
  index("media_uploaded_at_idx").on(table.uploadedAt),
]);

// Classes and their explicitly permitted subscription plans.
export const classesTable = pgTable("classes", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  coverImage: text("cover_image"),
  languageId: text("language_id").notNull().references(() => languagesTable.id),
  contentTypeId: text("content_type_id").notNull().references(() => contentTypesTable.id),
  mediaTypeId: text("media_type_id").notNull().references(() => mediaTypesTable.id),
  levelId: text("level_id").notNull().references(() => levelsTable.id),
  primaryTutorId: text("primary_tutor_id").notNull().references(() => userTable.id),
  createdById: text("created_by_id").references(() => userTable.id, { onDelete: "set null" }),
  status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("classes_status_idx").on(table.status),
  index("classes_language_idx").on(table.languageId),
  index("classes_primary_tutor_idx").on(table.primaryTutorId),
]);

export const classSubscriptionsTable = pgTable("class_subscriptions", {
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  pricingPlanId: text("pricing_plan_id").notNull().references(() => pricingPlansTable.id),
}, (table) => [
  uniqueIndex("class_subscriptions_pair_unique").on(table.classId, table.pricingPlanId),
  index("class_subscriptions_plan_idx").on(table.pricingPlanId),
]);

export const classTutorsTable = pgTable("class_tutors", {
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  tutorId: text("tutor_id").notNull().references(() => userTable.id),
}, (table) => [uniqueIndex("class_tutors_pair_unique").on(table.classId, table.tutorId), index("class_tutors_tutor_idx").on(table.tutorId)]);

export const classOutcomesTable = pgTable("class_outcomes", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull(),
}, (table) => [index("class_outcomes_class_idx").on(table.classId)]);

export const classOutlineItemsTable = pgTable("class_outline_items", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull(),
}, (table) => [index("class_outline_class_idx").on(table.classId)]);

export const classMaterialsTable = pgTable("class_materials", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["youtube", "audio", "pdf", "text"] }).notNull(),
  url: text("url"),
  content: text("content"),
  mimeType: text("mime_type"),
  filename: text("filename"),
  sortOrder: integer("sort_order").notNull().default(0),
}, (table) => [index("class_materials_class_idx").on(table.classId)]);

export const studentClassesTable = pgTable("student_classes", {
  studentId: text("student_id").notNull().references(() => userTable.id, { onDelete: "cascade" }),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
}, (table) => [uniqueIndex("student_classes_pair_unique").on(table.studentId, table.classId), index("student_classes_class_idx").on(table.classId)]);

export const blogPostsTable = pgTable("blog_posts", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  body: text("body").notNull(),
  featuredImage: text("featured_image"),
  imageAlt: text("image_alt"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("blog_posts_created_at_idx").on(table.createdAt)]);
