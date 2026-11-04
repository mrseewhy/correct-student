"use client";

import { useState } from "react";
import type { classOptions, getClass } from "@/lib/data/dal/classes";
import { PLATFORM_TUTOR_ID } from "@/lib/constants";
import { SearchableMultiSelect } from "@/components/ui/searchable-multiselect";
import { ClassEditor } from "@/components/dashboard/class-editor";

type Options = Awaited<ReturnType<typeof classOptions>>;
type ClassRecord = NonNullable<Awaited<ReturnType<typeof getClass>>>;
const input = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

export function ClassForm({
  options,
  record,
  action,
  defaultPrimaryTutorId,
  canManagePlatformTutor,
  actorRole,
  actorId,
}: {
  options: Options;
  record?: ClassRecord;
  action: (form: FormData) => Promise<void>;
  defaultPrimaryTutorId?: string;
  canManagePlatformTutor?: boolean;
  actorRole?: string;
  actorId?: string;
}) {
  const [mediaTypeId, setMediaTypeId] = useState(
    record?.mediaTypeId ?? options.mediaTypes.find(x => ["video", "audio", "text"].includes(x.name.toLowerCase()))?.id ?? "",
  );
  const [tutorIds, setTutorIds] = useState<string[]>(
    record ? record.tutors.map((t) => t.tutorId) : [],
  );
  const mediaKind = options.mediaTypes.find((x) => x.id === mediaTypeId)?.name.toLowerCase();
  const storedVideo = record?.materials.find((x) => x.kind === "youtube")?.url ?? "";
  const storedText = record?.materials.find((x) => x.kind === "text")?.content ?? "";

  // The platform tutor ("Correct Student tutor") is the platform's default tutor
  // and is only available to admin / super-admin actors.
  const tutorOptions = canManagePlatformTutor
    ? options.tutors
    : options.tutors.filter((t) => t.id !== PLATFORM_TUTOR_ID);

  // Create-mode role behaviour:
  // - Admin / super-admin: primary tutor dropdown shows only Correct Student Tutor.
  // - Tutor: primary tutor is fixed to the logged-in user (hidden input, no select).
  const isTutorCreate = actorRole === "tutor";
  const isAdminCreate = canManagePlatformTutor && !record;

  return (
    <form
      action={action}
      className="mt-6 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2"
    >
      {record && <input type="hidden" name="id" value={record.id} />}
      <label className="sm:col-span-1 text-sm font-medium">
        Class title
        <input
          name="title"
          required
          minLength={3}
          maxLength={180}
          defaultValue={record?.title}
          className={input}
        />
      </label>
      <label className="sm:col-span-1 text-sm font-medium">
        Slug
        <input
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          defaultValue={record?.slug}
          placeholder="Generated from title when blank"
          className={input}
        />
      </label>
      {/* Media type is chosen first so the conditional material inputs below depend on it. */}
      <label className="text-sm font-medium">
        Select media type
        <select
          name="mediaTypeId"
          value={mediaTypeId}
          onChange={(e) => setMediaTypeId(e.target.value)}
          className={input}
        >
          <option value="">Select media type</option>
          {options.mediaTypes.filter(x => ["video", "audio", "text"].includes(x.name.toLowerCase())).map((x) => (
            <option key={x.id} value={x.id}>{x.name}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Language
        <select
          name="languageId"
          defaultValue={record?.languageId ?? options.languages[0]?.id ?? ""}
          className={input}
        >
          <option value="">Select language</option>
          {options.languages.map((x) => (
            <option key={x.id} value={x.id}>{x.name}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Class type
        <select
          name="contentTypeId"
          defaultValue={record?.contentTypeId ?? options.contentTypes[0]?.id ?? ""}
          className={input}
        >
          <option value="">Select type</option>
          {options.contentTypes.map((x) => (
            <option key={x.id} value={x.id}>{x.name}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        Level
        <select
          name="levelId"
          defaultValue={record?.levelId ?? options.levels[0]?.id ?? ""}
          className={input}
        >
          <option value="">Select level</option>
          {options.levels.map((x) => (
            <option key={x.id} value={x.id}>{x.name}</option>
          ))}
        </select>
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium">Available to subscriptions</legend>
        <div className="mt-2 flex flex-wrap gap-5">
          {options.plans.map((x) => (
            <label key={x.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="planIds"
                value={x.id}
                defaultChecked={record?.plans.some((p) => p.pricingPlanId === x.id)}
              />
              {x.name}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="sm:col-span-2 text-sm font-medium">
        Description
        <ClassEditor initialDescription={record?.description ?? ""} name="description" />
      </label>
      <label className="text-sm font-medium">
        Duration in minutes
        <input
          name="durationMinutes"
          type="number"
          min={1}
          max={1440}
          defaultValue={record?.durationMinutes ?? 10}
          className={input}
        />
      </label>
      <label className="text-sm font-medium">
        Cover image (PNG, JPEG, WebP; up to 2 MB)
        <input
          name="coverImage"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className={input}
        />
        {record?.coverImage && (
          <span className="mt-1 block text-xs text-muted-foreground">
            Current cover retained unless replaced.
          </span>
        )}
      </label>
      {isTutorCreate ? (
        // Tutor creating a class: primary tutor is fixed to the logged-in user.
        <input type="hidden" name="primaryTutorId" value={actorId ?? ""} />
      ) : (
        <label className="text-sm font-medium">
          Primary tutor
          <select
            name="primaryTutorId"
            defaultValue={defaultPrimaryTutorId ?? ""}
            className={input}
          >
            {isAdminCreate ? (
              // Admin create: only Correct Student Tutor is available.
              options.tutors
                .filter((t) => t.id === PLATFORM_TUTOR_ID)
                .map((x) => (
                  <option key={x.id} value={x.id}>{x.name}</option>
                ))
            ) : (
              tutorOptions.map((x) => (
                <option key={x.id} value={x.id}>{x.name}</option>
              ))
            )}
          </select>
        </label>
      )}
      {actorRole !== "tutor" && <label className="text-sm font-medium">
        Other tutors (optional)
        <SearchableMultiSelect
          name="tutorIds"
          options={tutorOptions.map((t) => ({ id: t.id, label: t.name }))}
          value={tutorIds}
          onChange={setTutorIds}
          placeholder="Search tutors..."
        />
      </label>}
      {mediaKind === "video" && (
        <label className="sm:col-span-2 text-sm font-medium">
          YouTube video URL
          <input name="youtubeUrl" type="url" defaultValue={storedVideo} className={input} />
        </label>
      )}
      {mediaKind === "audio" && (
        <label className="sm:col-span-2 text-sm font-medium">
          Audio file (MP3, WAV, OGG; up to 3 MB)
          <input
            name="audioFile"
            type="file"
            accept="audio/mpeg,audio/wav,audio/ogg"
            className={input}
          />
          {record?.materials.some((x) => x.kind === "audio") && (
            <span className="mt-1 block text-xs">
              Current audio retained unless replaced.
            </span>
          )}
        </label>
      )}
      {mediaKind === "text" && (
        <>
          <label className="sm:col-span-2 text-sm font-medium">
            Extra text (optional)
            <textarea name="extraText" rows={5} defaultValue={storedText} className={input} />
          </label>
          <label className="sm:col-span-2 text-sm font-medium">
            PDF material (optional, up to 3 MB)
            <input name="pdfFile" type="file" accept="application/pdf" className={input} />
          </label>
        </>
      )}
      <label className="text-sm font-medium">
        Status
        <select name="status" defaultValue={record?.status ?? "draft"} className={input}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
          {record ? "Save class" : "Create class"}
        </button>
      </div>
    </form>
  );
}
