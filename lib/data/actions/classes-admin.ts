"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { getClass, saveClass, deleteClass, validateClassReferences, type ClassInput } from "@/lib/data/dal/classes";
import { db } from "@/lib";
import { mediaTypesTable } from "@/lib/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
  title: z.string().trim().min(3).max(180), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  description: z.string().trim().min(10),
  durationMinutes: z.coerce.number().int().min(1).max(1440),
  languageId: z.string().min(1), contentTypeId: z.string().min(1), mediaTypeId: z.string().min(1), levelId: z.string().min(1),
  primaryTutorId: z.string().min(1), status: z.enum(["draft", "published"]),
});

function youtubeUrl(value: string) {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== "https:" || !["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be"].includes(url.hostname)) throw new Error("Use a valid YouTube HTTPS URL.");
  const id = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1);
  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) throw new Error("Use a valid YouTube video URL.");
  return `https://www.youtube.com/watch?v=${id}`;
}
async function uploaded(file: FormDataEntryValue | null, kind: "audio" | "pdf") {
  if (!(file instanceof File) || !file.size) return null;
  if (file.size > 3_000_000) throw new Error(`${kind.toUpperCase()} must be under 3 MB.`);
  const bytes = Buffer.from(await file.arrayBuffer());
  const pdf = bytes.toString("ascii", 0, 5) === "%PDF-";
  const mp3 = bytes.toString("ascii", 0, 3) === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  const wav = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WAVE";
  const ogg = bytes.toString("ascii", 0, 4) === "OggS";
  const mimeType = kind === "pdf" && pdf ? "application/pdf" : kind === "audio" && mp3 ? "audio/mpeg" : kind === "audio" && wav ? "audio/wav" : kind === "audio" && ogg ? "audio/ogg" : null;
  if (!mimeType) throw new Error(kind === "pdf" ? "Upload a valid PDF." : "Upload an MP3, WAV, or OGG audio file.");
  return { kind, content: bytes.toString("base64"), mimeType, filename: file.name.slice(0, 255) } as const;
}
async function coverImage(file: FormDataEntryValue | null, existing: string | null) {
  if (!(file instanceof File) || !file.size) return existing;
  if (file.size > 2_000_000) throw new Error("Cover image must be under 2 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "image/png"
    : bytes.subarray(0, 3).equals(Buffer.from([255,216,255])) ? "image/jpeg"
    : bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP" ? "image/webp" : null;
  if (!mime) throw new Error("Cover image must be PNG, JPEG, or WebP.");
  return `data:${mime};base64,${bytes.toString("base64")}`;
}
async function inputFrom(form: FormData, existing?: Awaited<ReturnType<typeof getClass>>) {
  const rawTitle = String(form.get("title") ?? "").trim();
  const slug = String(form.get("slug") ?? "").trim() || rawTitle.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const parsed = schema.parse({
    title: rawTitle, slug, description: form.get("description"), durationMinutes: form.get("durationMinutes"),
    languageId: form.get("languageId"), contentTypeId: form.get("contentTypeId"), mediaTypeId: form.get("mediaTypeId"),
    levelId: form.get("levelId"), primaryTutorId: form.get("primaryTutorId"), status: form.get("status"),
  });
  const planIds = [...new Set(form.getAll("planIds").filter((v): v is string => typeof v === "string"))];
  const tutorIds = [...new Set(form.getAll("tutorIds").filter((v): v is string => typeof v === "string"))];
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
  revalidatePath("/admin/classes"); revalidatePath("/students/classes");
  redirect(`/admin/classes/${id}`);
}
export async function updateClassAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = String(form.get("id") ?? "");
  const existing = await getClass(id);
  if (!existing) redirect("/admin/classes");
  try { await saveClass(await inputFrom(form, existing), id); }
  catch (error) { redirect(`/admin/classes/${id}?error=${encodeURIComponent(errorMessage(error))}`); }
  revalidatePath("/admin/classes"); revalidatePath(`/admin/classes/${id}`); revalidatePath("/students/classes"); revalidatePath(`/students/classes/${existing.slug}`);
  redirect(`/admin/classes/${id}?saved=1`);
}
export async function deleteClassAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = String(form.get("id") ?? "");
  const existing = await getClass(id);
  if (!existing) redirect("/admin/classes");
  await deleteClass(id);
  revalidatePath("/admin/classes"); revalidatePath("/students/classes"); revalidatePath(`/students/classes/${existing.slug}`);
  redirect("/admin/classes");
}
