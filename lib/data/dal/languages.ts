import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib";
import { languagesTable } from "@/lib/schema";

// A language is identified by a single uuid `id`, matching every other
// content table.

export async function listLanguages() {
  return db.select()
    .from(languagesTable)
    .orderBy(desc(languagesTable.createdAt));
}

export async function getLanguage(id: string) {
  const [row] = await db.select()
    .from(languagesTable)
    .where(eq(languagesTable.id, id));
  return row ?? null;
}

export async function createLanguage(input: {
  name: string;
  code: string;
  is_active?: boolean;
}) {
  const [row] = await db.insert(languagesTable)
    .values(input)
    .returning();
  return row;
}

export async function updateLanguage(id: string, input: {
  name?: string;
  code?: string;
  is_active?: boolean;
}) {
  const [row] = await db.update(languagesTable)
    .set(input)
    .where(eq(languagesTable.id, id))
    .returning();
  return row;
}

export async function deleteLanguage(id: string) {
  await db.delete(languagesTable)
    .where(eq(languagesTable.id, id));
}
