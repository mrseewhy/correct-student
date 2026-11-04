import "server-only";

import { createHash } from "node:crypto";
import { sql, lt } from "drizzle-orm";
import { db } from "@/lib";
import { rateLimitsTable } from "@/lib/schema";
import { clientIp } from "@/lib/security/client-ip";

type RateLimitOptions = { identifier: string; action: string; limit: number; windowSeconds: number };

export async function rateLimit({ identifier, action, limit, windowSeconds }: RateLimitOptions) {
  const now = sql`statement_timestamp()`;
  const reset = sql`${now} + (${windowSeconds} * interval '1 second')`;
  const [record] = await db.insert(rateLimitsTable).values({
    identifier, action, count: 1, expiresAt: reset,
  }).onConflictDoUpdate({
    target: [rateLimitsTable.identifier, rateLimitsTable.action],
    set: {
      count: sql<number>`case when ${rateLimitsTable.expiresAt} <= ${now} then 1 else ${rateLimitsTable.count} + 1 end`,
      expiresAt: sql<Date>`case when ${rateLimitsTable.expiresAt} <= ${now} then ${reset} else ${rateLimitsTable.expiresAt} end`,
    },
  }).returning({
    count: rateLimitsTable.count,
    retryAfter: sql<number>`greatest(0, ceil(extract(epoch from (${rateLimitsTable.expiresAt} - ${now}))))::int`,
  });
  return { allowed: record.count <= limit, remaining: Math.max(0, limit - record.count), retryAfter: record.count > limit ? record.retryAfter : 0 };
}

const rates = {
  newsletter: { limit: 5, windowSeconds: 3600 },
  contact: { limit: 3, windowSeconds: 3600 },
  login: { limit: 5, windowSeconds: 900 },
  register: { limit: 3, windowSeconds: 3600 },
  email: { limit: 3, windowSeconds: 3600 },
  password: { limit: 5, windowSeconds: 900 },
} as const;

export async function rateLimiter(action: keyof typeof rates, headers: Headers) {
  const ip = clientIp(headers);
  if (!ip) return { allowed: false as const, reason: "unavailable" as const, retryAfter: 0 };
  try {
    const identifier = `ip:${createHash("sha256").update(ip).digest("hex")}`;
    const result = await rateLimit({ identifier, action, ...rates[action] });
    return result.allowed
      ? { allowed: true as const, remaining: result.remaining, retryAfter: 0 }
      : { allowed: false as const, reason: "rate-limited" as const, retryAfter: result.retryAfter };
  } catch (error) {
    console.error("Rate limiter database error:", error);
    return { allowed: false as const, reason: "unavailable" as const, retryAfter: 0 };
  }
}

export async function cleanupExpiredRateLimits() {
  await db.delete(rateLimitsTable).where(lt(rateLimitsTable.expiresAt, new Date()));
}
