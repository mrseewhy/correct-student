import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib";
import { levelsTable } from "@/lib/schema";

export type Level = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
};

export async function listLevels() {
  return db.select()
    .from(levelsTable)
    .orderBy(desc(levelsTable.createdAt));
}

export async function getLevel(id: string) {
  const [row] = await db.select()
    .from(levelsTable)
    .where(eq(levelsTable.id, id));
  return row ?? null;
}

export async function createLevel(input: { name: string; description?: string }) {
  const [row] = await db.insert(levelsTable)
    .values({ name: input.name, description: input.description ?? null })
    .returning();
  return row;
}

export async function updateLevel(id: string, input: { name?: string; description?: string }) {
  const [row] = await db.update(levelsTable)
    .set(input)
    .where(eq(levelsTable.id, id))
    .returning();
  return row;
}

export async function deleteLevel(id: string) {
  await db.delete(levelsTable)
    .where(eq(levelsTable.id, id));
}
