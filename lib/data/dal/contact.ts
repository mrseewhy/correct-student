import "server-only";

import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib";
import { contactMessagesTable } from "@/lib/schema";
import type { ContactFilter } from "@/validation/contact-admin";
import type { ContactInput } from "@/validation/contact";

export async function createContactMessage(input: Pick<ContactInput, "name" | "email" | "message">) {
  await db.insert(contactMessagesTable).values(input);
}

export async function listContactMessages(filter: ContactFilter) {
  return db.select({
    id: contactMessagesTable.id,
    name: contactMessagesTable.name,
    email: contactMessagesTable.email,
    message: contactMessagesTable.message,
    isRead: contactMessagesTable.isRead,
    submittedAt: contactMessagesTable.submittedAt,
  })
    .from(contactMessagesTable)
    .where(filter.status === "all" ? undefined : eq(contactMessagesTable.isRead, filter.status === "read"))
    .orderBy(desc(contactMessagesTable.submittedAt), desc(contactMessagesTable.id))
    .limit(filter.count);
}

export async function contactMessageStats() {
  const [row] = await db.select({
    total: count(),
    unread: sql<number>`count(*) filter (where ${contactMessagesTable.isRead} = false)`.mapWith(Number),
  }).from(contactMessagesTable);
  return row ?? { total: 0, unread: 0 };
}

export async function setContactMessageRead(id: number, isRead: boolean) {
  await db.update(contactMessagesTable).set({ isRead }).where(eq(contactMessagesTable.id, id));
}

