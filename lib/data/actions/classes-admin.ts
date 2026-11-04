"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getClass, saveClass, deleteClass, validateClassReferences, classOptions, type ClassInput } from "@/lib/data/dal/classes";
import { db } from "@/lib";
import { mediaTypesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { classDescriptionText } from "@/lib/class-description";
import { youtubeUrl, uploaded, coverImage } from "@/lib/class-uploads";
import { flashToast } from "@/lib/toast";

const schema = z.object({
  title: z.string().trim().min(3).max(180), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  description: z.string().trim(),
  durationMinutes: z.coerce.number().int().min(1).max(1440),
  languageId: z.string().min(1), contentTypeId: z.string().min(1), mediaTypeId: z.string().min(1), levelId: z.string().min(1),
  primaryTutorId: z.string().min(1), status: z.enum(["draft", "published"]),
});

async function inputFrom(form: FormData, existing?: Awaited<ReturnType<typeof getClass>>, tutorId?: string) {
  const rawTitle = String(form.get("title") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim() || rawTitle.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const options = await classOptions();
  const draft = form.get("status") === "draft";
  const parsed = schema.parse({
    title: rawTitle, slug, description: form.get("description") ?? "", durationMinutes: draft && !form.get("durationMinutes") ? 10 : form.get("durationMinutes"),
    languageId: form.get("languageId") || (draft && options.languages[0]?.id), contentTypeId: form.get("contentTypeId") || (draft && options.contentTypes[0]?.id), mediaTypeId: form.get("mediaTypeId") || (draft && options.mediaTypes.find(x => ["video", "audio", "text"].includes(x.name.toLowerCase()))?.id),
    levelId: form.get("levelId") || (draft && options.levels[0]?.id), primaryTutorId: tutorId ? existing?.primaryTutorId ?? tutorId : form.get("primaryTutorId"), status: form.get("status"),
  });
  if (parsed.status === "published" && !classDescriptionText(parsed.description).trim()) throw new Error("Add a description before publishing.");
  const planIds = [...new Set(form.getAll("planIds").filter((v): v is string => typeof v === "string"))];
  const tutorIds = tutorId ? existing?.tutors.map(x => x.tutorId) ?? [] : [...new Set(form.getAll("tutorIds").filter((v): v is string => typeof v === "string"))];
  const [mediaType] = await db.select().from(mediaTypesTable).where(eq(mediaTypesTable.id, parsed.mediaTypeId));
  const kind = mediaType?.name.toLowerCase();
  const materials: ClassInput["materials"] = [];
  const video = kind === "video" ? youtubeUrl(String(form.get("youtubeUrl") ?? "").trim()) : null;
  if (video) materials.push({ kind: "youtube", url: video });
  const audio = kind === "audio" ? await uploaded(form.get("audioFile"), "audio") : null;
  const pdf = kind === "text" ? await uploaded(form.get("pdfFile"), "pdf") : null;
  if (audio) materials.push(audio);
  if (pdf) materials.push(pdf);
  const extraText = kind === "text" ? String(form.get("extraText") ?? "").trim() : "";
  if (extraText) materials.push({ kind: "text", content: extraText.slice(0, 20_000) });
  if (existing && existing.mediaTypeId === parsed.mediaTypeId) {
    for (const old of existing.materials) {
      if (materials.some(item => item.kind === old.kind)) continue;
      if (old.kind === "text" && !extraText) continue;
      materials.push({ kind: old.kind, url: old.url ?? undefined, content: old.content ?? undefined, mimeType: old.mimeType ?? undefined, filename: old.filename ?? undefined });
    }
  }
  const input: ClassInput = { ...parsed, coverImage: await coverImage(form.get("coverImage"), existing?.coverImage ?? null), planIds, tutorIds, outcomes: [], outline: [], materials };
  await validateClassReferences(input);
  return input;
}
function errorMessage(error: unknown) {
  if (error instanceof z.ZodError) return error.issues[0]?.message ?? "Check the class fields.";
  if (error instanceof Error && /^(Choose|Select|Add|Use|Upload|Cover|PDF|AUDIO|The platform)/.test(error.message)) return error.message;
  if (error && typeof error === "object" && "code" in error && error.code === "23505") return "That class slug is already in use.";
  console.error("Class save failed", error);
  return "Could not save the class. Check the fields and try again.";
}
export async function createClassAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  let id: string;
  try { id = await saveClass(await inputFrom(form)); }
  catch (error) { redirect(`/admin/classes/create?error=${encodeURIComponent(errorMessage(error))}`); }
  await flashToast("success", "Class created.");
  revalidatePath("/admin/classes"); revalidatePath("/tutors/classes"); revalidatePath("/students/classes"); revalidatePath("/classes");
  redirect(`/admin/classes/${id}`);
}
export async function updateClassAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = String(form.get("id") ?? "");
  const existing = await getClass(id);
  if (!existing) { await flashToast("error", "Class not found."); redirect("/admin/classes"); }
  try { await saveClass(await inputFrom(form, existing), id); }
  catch (error) { redirect(`/admin/classes/${id}?error=${encodeURIComponent(errorMessage(error))}`); }
  await flashToast("success", "Class saved.");
  revalidatePath("/admin/classes"); revalidatePath(`/admin/classes/${id}`); revalidatePath("/tutors/classes"); revalidatePath(`/tutors/classes/${existing.slug}`); revalidatePath("/students/classes"); revalidatePath(`/students/classes/${existing.slug}`); revalidatePath("/classes"); revalidatePath(`/classes/${existing.slug}`);
  redirect(`/admin/classes/${id}`);
}
export async function deleteClassAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = String(form.get("id") ?? "");
  const existing = await getClass(id);
  if (!existing) { await flashToast("error", "Class not found."); redirect("/admin/classes"); }
  try { await deleteClass(id); }
  catch { await flashToast("error", "Could not delete the class."); redirect("/admin/classes"); }
  await flashToast("success", "Class deleted.");
  revalidatePath("/admin/classes"); revalidatePath("/tutors/classes"); revalidatePath(`/tutors/classes/${existing.slug}`); revalidatePath("/students/classes"); revalidatePath(`/students/classes/${existing.slug}`); revalidatePath("/classes"); revalidatePath(`/classes/${existing.slug}`);
  redirect("/admin/classes");
}

export async function createTutorClassAction(form: FormData) {
  const { user } = await requireRole(["tutor"]);
  let id: string;
  try { id = await saveClass(await inputFrom(form, undefined, user.id), undefined, user.id); }
  catch (error) { redirect(`/tutors/classes/create?error=${encodeURIComponent(errorMessage(error))}`); }
  await flashToast("success", "Class created.");
  revalidatePath("/tutors/classes"); revalidatePath("/admin/classes"); revalidatePath("/students/classes"); revalidatePath("/classes");
  const created = await getClass(id);
  redirect(`/tutors/classes/${created!.slug}/edit`);
}

export async function updateTutorClassAction(form: FormData) {
  const { user } = await requireRole(["tutor"]);
  const id = String(form.get("id") ?? "");
  const existing = await getClass(id);
  if (!existing || existing.createdById !== user.id) { await flashToast("error", "Class not found or unavailable."); redirect("/tutors/classes"); }
  try { await saveClass(await inputFrom(form, existing, user.id), id); }
  catch (error) { redirect(`/tutors/classes/${existing.slug}/edit?error=${encodeURIComponent(errorMessage(error))}`); }
  await flashToast("success", "Class saved.");
  revalidatePath("/tutors/classes"); revalidatePath(`/tutors/classes/${existing.slug}`); revalidatePath("/admin/classes");
  revalidatePath("/students/classes"); revalidatePath(`/students/classes/${existing.slug}`); revalidatePath("/classes");
  const updated = await getClass(id);
  redirect(`/tutors/classes/${updated!.slug}/edit`);
}

export async function deleteTutorClassAction(form: FormData) {
  const { user } = await requireRole(["tutor"]);
  const id = String(form.get("id") ?? "");
  const existing = await getClass(id);
  if (!existing || existing.createdById !== user.id) { await flashToast("error", "Class not found or unavailable."); redirect("/tutors/classes"); }
  try { await deleteClass(id); }
  catch { await flashToast("error", "Could not delete the class."); redirect("/tutors/classes"); }
  await flashToast("success", "Class deleted.");
  revalidatePath("/tutors/classes"); revalidatePath("/admin/classes"); revalidatePath("/students/classes"); revalidatePath(`/students/classes/${existing.slug}`); revalidatePath("/classes");
  redirect("/tutors/classes");
}
