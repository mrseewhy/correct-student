import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib";
import { PLATFORM_TUTOR_ID } from "@/lib/constants";
import {
  classesTable, classSubscriptionsTable, classTutorsTable, classOutcomesTable,
  classOutlineItemsTable, classMaterialsTable, pricingPlansTable, userTable,
  languagesTable, contentTypesTable, mediaTypesTable, levelsTable, studentClassesTable,
} from "@/lib/schema";

export { PLATFORM_TUTOR_ID };
export type ClassInput = {
  slug: string; title: string; description: string; durationMinutes: number; coverImage: string | null;
  languageId: string; contentTypeId: string; mediaTypeId: string; levelId: string;
  primaryTutorId: string; status: "draft" | "published";
  planIds: string[]; tutorIds: string[]; outcomes: string[]; outline: { title: string; description: string }[];
  materials: { kind: "youtube" | "audio" | "pdf" | "text"; url?: string; content?: string; mimeType?: string; filename?: string }[];
};

export async function classOptions() {
  const [languages, contentTypes, mediaTypes, levels, plans, tutors] = await Promise.all([
    db.select().from(languagesTable).where(eq(languagesTable.is_active, true)),
    db.select().from(contentTypesTable), db.select().from(mediaTypesTable),
    db.select().from(levelsTable), db.select().from(pricingPlansTable).where(inArray(pricingPlansTable.planKey, ["free", "starter", "plus", "premium"])),
    db.select({ id: userTable.id, name: userTable.name }).from(userTable).where(eq(userTable.role, "tutor")),
  ]);
  return { languages, contentTypes, mediaTypes, levels, plans, tutors };
}

export async function validateClassReferences(input: ClassInput) {
  const options = await classOptions();
  if (!options.languages.some(x => x.id === input.languageId) ||
    !options.contentTypes.some(x => x.id === input.contentTypeId) ||
    !options.levels.some(x => x.id === input.levelId)) throw new Error("Choose valid class options.");
  const mediaType = options.mediaTypes.find(x => x.id === input.mediaTypeId);
  if (!mediaType || !["video", "audio", "text"].includes(mediaType.name.toLowerCase())) throw new Error("Choose a supported media type.");
  if (!options.tutors.some(x => x.id === input.primaryTutorId) ||
    input.tutorIds.some(id => id === input.primaryTutorId || !options.tutors.some(x => x.id === id))) throw new Error("Choose valid tutors.");
  if (input.planIds.some(id => !options.plans.some(x => x.id === id))) throw new Error("Choose valid plans.");
  if (input.status === "published" && !input.planIds.length) throw new Error("Select at least one subscription to publish.");
  return mediaType.name.toLowerCase();
}

export async function listClasses() {
  return db.select({ id: classesTable.id, slug: classesTable.slug, title: classesTable.title,
    primaryTutorId: classesTable.primaryTutorId, createdById: classesTable.createdById,
    description: classesTable.description, durationMinutes: classesTable.durationMinutes,
    coverImage: classesTable.coverImage, status: classesTable.status,
    language: languagesTable.name, level: levelsTable.name, type: contentTypesTable.name,
    mediaType: mediaTypesTable.name,
    tutor: userTable.name })
    .from(classesTable).innerJoin(languagesTable, eq(classesTable.languageId, languagesTable.id))
    .innerJoin(levelsTable, eq(classesTable.levelId, levelsTable.id))
    .innerJoin(contentTypesTable, eq(classesTable.contentTypeId, contentTypesTable.id))
    .innerJoin(mediaTypesTable, eq(classesTable.mediaTypeId, mediaTypesTable.id))
    .innerJoin(userTable, eq(classesTable.primaryTutorId, userTable.id))
    .orderBy(asc(classesTable.title));
}

export async function getClass(id: string) {
  const [row] = await db.select().from(classesTable).where(eq(classesTable.id, id));
  if (!row) return null;
  const [plans, tutors, outcomes, outline, materials, mediaType] = await Promise.all([
    db.select().from(classSubscriptionsTable).where(eq(classSubscriptionsTable.classId, id)),
    db.select().from(classTutorsTable).where(eq(classTutorsTable.classId, id)),
    db.select().from(classOutcomesTable).where(eq(classOutcomesTable.classId, id)).orderBy(asc(classOutcomesTable.sortOrder)),
    db.select().from(classOutlineItemsTable).where(eq(classOutlineItemsTable.classId, id)).orderBy(asc(classOutlineItemsTable.sortOrder)),
    db.select().from(classMaterialsTable).where(eq(classMaterialsTable.classId, id)).orderBy(asc(classMaterialsTable.sortOrder)),
    db.select({ name: mediaTypesTable.name }).from(mediaTypesTable).where(eq(mediaTypesTable.id, row.mediaTypeId)),
  ]);
  return { ...row, plans, tutors, outcomes, outline, materials, mediaTypeName: mediaType[0]?.name ?? "" };
}

export async function getClassBySlug(slug: string) {
  const [row] = await db.select({ id: classesTable.id }).from(classesTable).where(eq(classesTable.slug, slug));
  return row ? getClass(row.id) : null;
}

export async function classPlanKeys(classId: string) {
  return db.select({ planKey: pricingPlansTable.planKey, name: pricingPlansTable.name })
    .from(classSubscriptionsTable).innerJoin(pricingPlansTable, eq(classSubscriptionsTable.pricingPlanId, pricingPlansTable.id))
    .where(eq(classSubscriptionsTable.classId, classId));
}

export async function canAccessClass(classId: string, planKey: string) {
  const [match] = await db.select({ id: classesTable.id }).from(classesTable)
    .innerJoin(classSubscriptionsTable, eq(classSubscriptionsTable.classId, classesTable.id))
    .innerJoin(pricingPlansTable, eq(pricingPlansTable.id, classSubscriptionsTable.pricingPlanId))
    .where(and(eq(classesTable.id, classId), eq(classesTable.status, "published"), eq(pricingPlansTable.planKey, planKey)))
    .limit(1);
  return Boolean(match);
}

export async function saveClass(input: ClassInput, id?: string, createdById?: string) {
  return db.transaction(async tx => {
    const [row] = id
      ? await tx.update(classesTable).set({ ...base(input), updatedAt: new Date() }).where(eq(classesTable.id, id)).returning()
      : await tx.insert(classesTable).values({ ...base(input), createdById: createdById ?? input.primaryTutorId }).returning();
    if (!row) throw new Error("Class not found.");
    await tx.delete(classSubscriptionsTable).where(eq(classSubscriptionsTable.classId, row.id));
    await tx.delete(classTutorsTable).where(eq(classTutorsTable.classId, row.id));
    await tx.delete(classOutcomesTable).where(eq(classOutcomesTable.classId, row.id));
    await tx.delete(classOutlineItemsTable).where(eq(classOutlineItemsTable.classId, row.id));
    const oldMaterials = await tx.select().from(classMaterialsTable).where(eq(classMaterialsTable.classId, row.id));
    if (input.planIds.length) await tx.insert(classSubscriptionsTable).values(input.planIds.map(pricingPlanId => ({ classId: row.id, pricingPlanId })));
    if (input.tutorIds.length) await tx.insert(classTutorsTable).values(input.tutorIds.map(tutorId => ({ classId: row.id, tutorId })));
    if (input.outcomes.length) await tx.insert(classOutcomesTable).values(input.outcomes.map((text, sortOrder) => ({ classId: row.id, text, sortOrder })));
    if (input.outline.length) await tx.insert(classOutlineItemsTable).values(input.outline.map((part, sortOrder) => ({ classId: row.id, ...part, sortOrder })));
    const retainedIds = new Set<string>();
    for (const [sortOrder, material] of input.materials.entries()) {
      const old = oldMaterials.find(item => item.kind === material.kind && !retainedIds.has(item.id));
      if (old) {
        retainedIds.add(old.id);
        await tx.update(classMaterialsTable).set({ ...material, sortOrder }).where(eq(classMaterialsTable.id, old.id));
      } else {
        await tx.insert(classMaterialsTable).values({ classId: row.id, ...material, sortOrder });
      }
    }
    for (const old of oldMaterials) {
      if (!retainedIds.has(old.id)) await tx.delete(classMaterialsTable).where(eq(classMaterialsTable.id, old.id));
    }
    return row.id;
  });
}
function base(input: ClassInput) {
  return { slug: input.slug, title: input.title, description: input.description, durationMinutes: input.durationMinutes,
    coverImage: input.coverImage, languageId: input.languageId, contentTypeId: input.contentTypeId,
    mediaTypeId: input.mediaTypeId, levelId: input.levelId, primaryTutorId: input.primaryTutorId, status: input.status };
}

export async function deleteClass(id: string) {
  await db.delete(classesTable).where(eq(classesTable.id, id));
}

export async function reassignTutorClasses(tutorId: string) {
  if (tutorId === PLATFORM_TUTOR_ID) throw new Error("The platform tutor cannot be deleted.");
  await db.transaction(async tx => {
    const [platform] = await tx.select({ id: userTable.id }).from(userTable).where(and(eq(userTable.id, PLATFORM_TUTOR_ID), eq(userTable.role, "tutor")));
    if (!platform) throw new Error("The platform tutor must be provisioned before deleting tutors.");
    await tx.update(classesTable).set({ primaryTutorId: platform.id, updatedAt: new Date() }).where(eq(classesTable.primaryTutorId, tutorId));
    await tx.delete(classTutorsTable).where(eq(classTutorsTable.tutorId, tutorId));
    await tx.delete(userTable).where(and(eq(userTable.id, tutorId), eq(userTable.role, "tutor")));
  });
}

export async function markClassStarted(studentId: string, classId: string) {
  await db.insert(studentClassesTable).values({ studentId, classId, lastAccessedAt: new Date() })
    .onConflictDoUpdate({ target: [studentClassesTable.studentId, studentClassesTable.classId], set: { lastAccessedAt: new Date() } });
}
export async function markClassCompleted(studentId: string, classId: string) {
  const [updated] = await db.update(studentClassesTable)
    .set({ completedAt: new Date(), lastAccessedAt: new Date() })
    .where(and(eq(studentClassesTable.studentId, studentId), eq(studentClassesTable.classId, classId)))
    .returning({ classId: studentClassesTable.classId });
  return Boolean(updated);
}
export async function studentClassProgress(studentId: string, classId: string) {
  const [row] = await db.select().from(studentClassesTable).where(and(eq(studentClassesTable.studentId, studentId), eq(studentClassesTable.classId, classId)));
  return row ?? null;
}
export async function tutorClasses(tutorId: string) {
  const collaborations = await db.select({ classId: classTutorsTable.classId }).from(classTutorsTable).where(eq(classTutorsTable.tutorId, tutorId));
  const ids = collaborations.map(x => x.classId);
  const all = await listClasses();
  const primaryIds = await db.select({ id: classesTable.id }).from(classesTable).where(eq(classesTable.primaryTutorId, tutorId));
  const createdIds = await db.select({ id: classesTable.id }).from(classesTable).where(eq(classesTable.createdById, tutorId));
  const allowed = new Set([...ids, ...primaryIds.map(x => x.id), ...createdIds.map(x => x.id)]);
  return all.filter(x => allowed.has(x.id));
}
