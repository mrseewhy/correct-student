import "server-only";

import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/lib";
import { newsletterSubscriptionsTable } from "@/lib/schema";
import { newsletterDateRange, type NewsletterFilter } from "@/validation/newsletter-admin";

export async function subscribeNewsletter(email: string) {
  await db.insert(newsletterSubscriptionsTable).values({ email }).onConflictDoUpdate({
    target: newsletterSubscriptionsTable.email,
    set: { status: "subscribed", subscribedAt: sql`now()` },
  });
}

export async function listNewsletterSubscriptions(filter: NewsletterFilter) {
  const range = newsletterDateRange(filter);
  const conditions = [eq(newsletterSubscriptionsTable.status, "subscribed")];
  if (range?.start) conditions.push(gte(newsletterSubscriptionsTable.subscribedAt, range.start));
  if (range?.end) conditions.push(lt(newsletterSubscriptionsTable.subscribedAt, range.end));
  return db.select({ id: newsletterSubscriptionsTable.id, email: newsletterSubscriptionsTable.email, subscribedAt: newsletterSubscriptionsTable.subscribedAt, status: newsletterSubscriptionsTable.status })
    .from(newsletterSubscriptionsTable)
    .where(and(...conditions))
    .orderBy(desc(newsletterSubscriptionsTable.subscribedAt), desc(newsletterSubscriptionsTable.id))
    .limit(filter.count);
}

