import { cleanupExpiredRateLimits } from "@/lib/security/ratelimit";

/**
 * Cron endpoint: removes expired rate-limit counters from the database.
 *
 * Configure a recurring job (Vercel Cron, cron-job.org, etc.) to call this
 * endpoint on a schedule, e.g. once per hour:
 *   GET https://<your-domain>/api/cron/cleanup-rate-limits
 *
 * Set CRON_SECRET and send
 *   Authorization: Bearer <CRON_SECRET>
 * with each request.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new Response("Service Unavailable", { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await cleanupExpiredRateLimits();
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Rate limit cleanup failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
