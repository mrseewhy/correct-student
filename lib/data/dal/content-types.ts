import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib";
import { contentTypesTable } from "@/lib/schema";

export type ContentType = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export async function listContentTypes() {
  return db.select()
    .from(contentTypesTable)
    .orderBy(desc(contentTypesTable.createdAt));
}

export async function getContentType(id: string) {
  const [row] = await db.select()
    .from(contentTypesTable)
    .where(eq(contentTypesTable.id, id));
  return row ?? null;
}

export async function createContentType(input: { name: string; description?: string }) {
  const [row] = await db.insert(contentTypesTable)
    .values({ name: input.name, description: input.description ?? null })
    .returning();
  return row;
}

export async function updateContentType(id: string, input: { name?: string; description?: string }) {
  const [row] = await db.update(contentTypesTable)
    .set(input)
    .where(eq(contentTypesTable.id, id))
    .returning();
  return row;
}

export async function deleteContentType(id: string) {
  await db.delete(contentTypesTable)
    .where(eq(contentTypesTable.id, id));
}
