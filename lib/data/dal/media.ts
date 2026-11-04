import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib";
import { mediaTable } from "@/lib/schema";

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  mediaType: "video" | "text" | "audio";
  uploadedAt: Date;
};

export async function listMedia() {
  return db.select()
    .from(mediaTable)
    .orderBy(desc(mediaTable.uploadedAt));
}

export async function getMediaItem(id: string) {
  const [row] = await db.select()
    .from(mediaTable)
    .where(eq(mediaTable.id, id));
  return row ?? null;
}

export async function createMediaItem(input: { filename: string; url: string; mediaType: "video" | "text" | "audio" }) {
  const [row] = await db.insert(mediaTable)
    .values(input)
    .returning();
  return row;
}

export async function deleteMediaItem(id: string) {
  await db.delete(mediaTable)
    .where(eq(mediaTable.id, id));
}
