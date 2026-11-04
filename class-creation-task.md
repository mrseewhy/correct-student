# Class creation: implementation handoff

> **November 2026 revision:** This document began as an implementation plan and parts of its original state description and checklist are historical. The current flow is database backed. The agreed revisions supersede the older requirements below: learning outcomes and outline fields are removed from the class form; descriptions have no word limit; a draft may be saved with only a title (the application supplies internal defaults for required database fields); PDF content is optional for Text classes; and creator tutors may create, edit, and delete their classes. Published Video and Audio classes may show “media coming soon” until material is attached, and cannot be completed without material. Existing browser-only tutor drafts are not automatically imported. See `README.md` for current limits.

## Goal and current state

Build persistent class creation, management, subscription access, and per-student completion. All **published class cards** are visible to students. A student may open details, outline, and materials only when their **current subscription plan** is explicitly checked for that class. There is no automatic plan inheritance: Premium does not grant access to a class checked only for Starter. Draft classes are not visible to students.

This document is a plan, not a claim that the feature has been implemented. Currently `/admin/classes` and its detail page read static records from `lib/admin-data.ts`; student and tutor class pages read `lib/catalog.ts`; tutor drafts in `components/dashboard/class-creator.tsx` live in `localStorage`. The project already has database tables for users, languages, content types, media types, levels, pricing plans, and media metadata. `user.subscription` is the student's single current plan key (`free`, `starter`, `plus`, `premium`). Direct file upload is not yet connected.

Read `AGENTS.md` and the relevant installed Next.js 16 docs in `node_modules/next/dist/docs/` before changing app code. Preserve existing role checks in protected pages and server actions. Check `git status` before editing; much of this project is currently untracked or modified, so do not discard unrelated work.

## Agreed class form

1. **Class title**: required; generate a unique, stable URL slug. Editing a title should not silently break an existing URL.
2. **Language**: select an active row from `languages`.
3. **Class type**: select a row from `content_types` (for example, Lesson, Story, Song).
4. **Media type**: select Video, Audio, or Text from `media_types`. Show a YouTube URL for Video, an audio upload for Audio, and an optional PDF upload and/or extra text for Text. The full description is separate from this material. Validate the choice and associated data on the server, not only through conditional UI. Decide how newly created media-type rows map to supported input behavior; do not accept an unknown type without a defined editor and validator.
5. **Level**: select a row from `levels`.
6. **Subscriptions**: four explicit checkboxes for Free, Starter, Plus, Premium, backed by current `pricing_plans` rows. Require at least one selection before publishing. No implicit tier inheritance.
7. **Description**: one field, with an enforced word limit on save. Show an ellipsis or line clamp on cards and the full description on an authorized detail page. Choose and document the numeric word limit before implementing validation; use the same limit in UI and server validation.
8. **Duration**: positive number of minutes.
9. **Cover image**: upload or select an image; provide meaningful alt text or use the class title where appropriate.
10. **Learning outcomes**: ordered repeatable entries.
11. **Class content or outline**: ordered repeatable sections.
12. **Status**: Draft or Published. Publishing requires all data needed to render the class and at least one allowed plan. Saving a draft may allow incomplete content.
13. **Primary tutor**: select an existing tutor; default to a permanent platform tutor named **Correct Student tutor**.
14. **Other tutors**: optional multiple selection. Prevent duplicates and prevent the primary tutor from also being a collaborator.

There is **no class-level Completed field**. Completion is per student and belongs in `student_classes`.

## Database design

Reuse `user`, `languages`, `content_types`, `media_types`, `levels`, and `pricing_plans` from `lib/schema.ts`. Add migrations and Drizzle definitions for:

| Table | Fields and constraints |
| --- | --- |
| `classes` | `id` primary key, unique `slug`, `title`, `description`, `duration_minutes`, `cover_image` reference or key, `language_id`, `content_type_id`, `media_type_id`, `primary_tutor_id`, `status`, `created_at`, `updated_at`. Foreign keys to existing tables. Index status, language, and primary tutor for listings. |
| `class_subscriptions` | `class_id`, `pricing_plan_id`; composite primary/unique key and indexes for access queries. Cascade on class deletion. Decide plan deletion policy deliberately; deleting a plan must not silently leave a published class with zero allowed plans. |
| `class_tutors` | `class_id`, `tutor_id`; composite primary/unique key. Cascade on class deletion; remove a tutor's collaborator rows before deleting the tutor. |
| `class_outcomes` | `id`, `class_id`, `text`, `sort_order`; cascade on class deletion. |
| `class_outline_items` | `id`, `class_id`, `title`, optional `description`, `sort_order`; cascade on class deletion. |
| `class_materials` | `id`, `class_id`, `kind` (`youtube`, `audio`, `pdf`, `text`), optional `url` or storage key, optional `text`, `sort_order`; cascade on class deletion. Enforce the valid payload for each kind in application validation and, where practical, database constraints. |
| `student_classes` | `student_id`, `class_id`, `started_at`, optional `last_accessed_at`, optional `completed_at`; unique `(student_id, class_id)`. This is the student registration/progress record. Preserve completion history when a student's plan changes. |

The four plan checkboxes should resolve to the existing `pricing_plans` rows by stable `plan_key`. Keep the `user.subscription` key and pricing-plan keys consistent. A separate user-to-plan pivot is not needed for the current one-plan-per-user model; billing history and expiry are outside this feature.

The current `media` table stores metadata and public URLs, and its validator supports `video`, `text`, and `audio`. Reconcile that table with `class_materials` instead of duplicating uploads. The storage design must prevent an unauthorized student from fetching protected audio/PDF using a public URL. YouTube links cannot be made subscription-private merely by hiding the link; treat YouTube content as link-protected only unless a different video host is chosen.

## Implementation sequence

1. **Inventory and decisions.** Inspect the files named above, existing CRUD conventions under `lib/data/dal/` and `lib/data/actions/`, auth/session checks, and the upload approach used by blog images. Set the description word limit, permitted upload size/types, and whether a class needs exactly one primary material or may have several. Record these decisions here before building the form.
2. **Migrate the database.** Define the new tables, foreign keys, uniqueness, indexes, and deletion behavior in `lib/schema.ts`; generate a Drizzle migration and inspect its SQL. Seed or provision the permanent Correct Student tutor in an idempotent way. Give it a stable identifier and prevent its deletion or role change. Do not hardcode a guessed database ID.
3. **Build validated data operations.** Add class schemas under `validation/`, DAL reads/writes under `lib/data/dal/`, and role-protected server actions under `lib/data/actions/`. Create/update class and its plans, tutors, outcomes, outline, and materials in a transaction. Generate unique slugs, validate foreign keys and roles, and return useful field errors. Never trust a submitted tutor ID or plan ID merely because it came from a select element.
4. **Handle tutor deletion.** Before removing a tutor, reassign their primary classes to Correct Student tutor and delete their collaborator links in the same transaction. Integrate this with the actual tutor deletion path in `lib/data/actions/users-admin.ts`. Ensure other account deletion paths cannot bypass the reassignment. Do not cascade-delete classes when a tutor is deleted.
5. **Create admin UI.** Replace static `/admin/classes` list/detail with database-backed list, create, edit, publish/unpublish, and delete flows. Populate selectors from active lookup tables and actual tutor users. Show conditional media inputs, the four plan checkboxes, ordered outcomes/outline fields, and validation messages. Protect pages and actions for admin/super-admin as in existing admin CRUD.
6. **Unify tutor views.** Replace the tutor `localStorage` draft flow with database-backed classes. A tutor should see classes where they are primary or collaborator. Decide whether tutors can edit their own drafts; if yes, enforce ownership in every write action. Remove or migrate the local draft UI carefully so users are not misled that browser drafts are published classes.
7. **Student catalog and access.** Read published class cards from the database for all students. Cards may show title, image, clamped description, level, tutor, and eligible plans; do not include protected description detail, outline, material URLs, or files in card data. On `/students/classes/[slug]`, load the session and check the student's current `user.subscription` against `class_subscriptions` on the server before returning details or materials. Show a locked page with eligible plans and an upgrade link when access fails. Apply the same check to every content/file endpoint; hiding buttons is insufficient.
8. **Progress.** Create/upsert a `student_classes` row only when an eligible student starts a class. Mark completion with `completed_at` for that student only. Define whether completion is a manual action or automatic after consuming all sections; start with a clear manual completion action if no lesson tracking exists. Recheck access before progress mutations. Retain existing progress if a plan changes, but deny current content access when the new plan is not checked.
9. **Public/demo cleanup.** Review public class preview routes and `lib/catalog.ts`. Decide whether published DB classes replace public static previews; public pages must not disclose protected materials or full details. Remove static admin class records and stale demo links only after database-backed pages are working. Update README to reflect the actual state.
10. **Verify.** Apply the migration in a test database. Check create/edit/draft/publish, each media type, upload validation, zero and multiple selected plans, slug collisions, tutor reassignment, duplicate collaborators, and class deletion. Test every student plan against every checked-plan combination: all published cards visible, only matching plans open details/content, and direct URL or file requests cannot bypass access. Test completion for two different students and plan changes. Run `npx tsc --noEmit`, `npm run lint`, and `npm run build` (the build may need network access for Google Fonts). Follow the `AGENTS.md` Next.js feedback pass before final reporting if applicable.

## Resume checklist

- [ ] Read current `git status`, `AGENTS.md`, and relevant Next.js docs.
- [ ] Confirm decisions in step 1 and update this file.
- [ ] Add schema and reviewed migration.
- [ ] Add idempotent platform tutor provisioning and safe tutor deletion.
- [ ] Add validated class DAL and server actions.
- [ ] Replace static admin and tutor class flows.
- [ ] Add student card, server-side lock, protected materials, and progress flows.
- [ ] Verify access matrix, deletion behavior, and project checks.
- [ ] Update README and report any remaining limitations.
