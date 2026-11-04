import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib";
import { mediaTypesTable } from "@/lib/schema";

export type MediaType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export async function listMediaTypes() {
  return db.select()
    .from(mediaTypesTable)
    .orderBy(desc(mediaTypesTable.createdAt));
}

export async function getMediaType(id: string) {
  const [row] = await db.select()
    .from(mediaTypesTable)
    .where(eq(mediaTypesTable.id, id));
  return row ?? null;
}

export async function createMediaType(input: { name: string; description?: string }) {
  const [row] = await db.insert(mediaTypesTable)
    .values({ name: input.name, description: input.description ?? null })
    .returning();
  return row;
}

export async function updateMediaType(id: string, input: { name?: string; description?: string }) {
  const [row] = await db.update(mediaTypesTable)
    .set(input)
    .where(eq(mediaTypesTable.id, id))
    .returning();
  return row;
}

export async function deleteMediaType(id: string) {
  await db.delete(mediaTypesTable)
    .where(eq(mediaTypesTable.id, id));
}
