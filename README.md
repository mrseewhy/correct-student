# Correct Student

Correct Student is a Next.js 16 app for language learning, with a public site and separate student, tutor, and admin workspaces. This README describes the current implementation, including the parts that are still demos.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and the appropriate `BETTER_AUTH_URL`.
3. Apply the database migrations with `npx drizzle-kit migrate`.
4. Create the first super admin with `node scripts/seed-super-admin.mjs <email> <name> <username> <password>`.
5. Start the app with `npm run dev`.

Use `npx tsc --noEmit`, `npm run lint`, and `npm run build` for code checks. The production build fetches Ubuntu and Lato from Google Fonts, so the build environment needs access to that service.

## Implemented

- Public marketing pages, class and shop previews, blog content, pricing, sign up, and sign in.
- Better Auth with student, tutor, admin, and super admin roles. Protected dashboard pages and server actions check the database session and role; the proxy provides early navigation only.
- Database backed contact submissions and newsletter signups, with honeypot fields and IP based rate limits.
- Admin contact inbox with filtering, unread count, and **read/unread status changes only**.
- Admin newsletter subscriber list with date filters and CSV export. It is **read only**.
- Admin create, read, update, and delete flows for students, tutors, languages, content types, media types, levels, and pricing plans. Admin account management is restricted to super admins; deletion of user accounts is also restricted to super admins.
- Admin user search, ban/unban, and password reset controls. Pricing plan edits feed the public pricing page.
- Admin blog post create, read, update, delete, draft/publish, and optional featured image upload. The post list has database backed title filtering and pagination (10, 20, 50, or 100 posts per page). The BlockNote editor has a toolbar pinned above the article; the excerpt and image description are generated from the post, and new posts use the Article category. Posts without an uploaded image use the default blog image. Six example posts are published through `scripts/seed-blog-posts.mjs`; the script is safe to rerun and leaves existing posts unchanged.
- Media metadata can be added by URL; direct file upload is not connected.

The admin Subscriptions area manages **pricing plans** and user plan assignments. It does not manage recurring payments or billing subscriptions.

## Current limits

- Student learning progress, tutor students, schedules, assignments, and messages use demo data from `lib/workspace-data.ts`.
- Tutor class drafts are stored in browser `localStorage`, not in the database or public catalog.
- Several admin sections, including classes, products, orders, coupons, and activities, display static records from `lib/admin-data.ts`.
- The shop has a demo cart only. Checkout, payment, real orders, and paid subscription activation are not implemented; paid pricing buttons lead to the contact page.
- Lesson delivery, durable progress tracking, profile editing, and platform settings are not implemented.
- Automated regression tests are still needed. A manual database backed admin CRUD pass verified create, read, update, and delete for students, tutors, admins, languages, content types, media types, levels, pricing plans, and blog posts; the temporary records were removed afterward. Contact read/unread changes and the newsletter's read only UI were also verified. This pass does not cover every validation or permission edge case.

## Do not change without a new requirement

- Keep **Newsletter** admin access read only. Do not add admin create, edit, delete, or subscriber status controls. Public newsletter signup remains available.
- Keep **Contact** admin access limited to reading messages and changing their read/unread status. Do not add admin create, message edit, or delete controls. Public contact submission remains available.
- Preserve role checks inside every protected server action and page. The proxy cookie check alone does not authorize access.
- Keep super admin restrictions on admin account management and user deletion.
- Do not present demo learning, commerce, or static admin records as live database data until those features are implemented.
- Do not remove the generated Next.js instructions or feedback block in `AGENTS.md`; `next dev` restores them.

These are project scope boundaries for upcoming work, not a claim that the unfinished features are complete.

## Operations

The rate limiter stores counters in PostgreSQL. Expired counters can be removed through `DELETE FROM rate_limits WHERE expires_at < now();` or the `/api/cron/cleanup-rate-limits` route. Configure `CRON_SECRET` and a scheduled caller before relying on the route in production.

On Vercel, the limiter uses the platform supplied `x-forwarded-for` header. For a VPS, configure the reverse proxy to overwrite `x-real-ip`, prevent direct access to the app server, and set `TRUST_PROXY_IP_HEADERS=true`. Without a trusted address, rate limiting fails closed.
