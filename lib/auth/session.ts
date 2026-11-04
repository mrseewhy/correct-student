import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { isRole, type UserRole } from "@/lib/auth/permissions";

type BaseUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role?: string;
  subscription?: string;
  banned?: boolean;
  banReason?: string | null;
  [key: string]: unknown;
};

type SessionPayload = {
  id: string;
  token: string;
  expiresAt: Date;
  userId: string;
  [key: string]: unknown;
};

export type UserSession = {
  user: {
    id: string;
    name: string;
    email: string;
    username: string | null;
    role: UserRole;
    subscription: string;
    banned: boolean;
    banReason: string | null;
  };
  session: SessionPayload;
};

function mapSession(user: BaseUser, session: SessionPayload): UserSession | null {
  if (user.banned || !isRole(user.role)) return null;

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username ?? null,
      role: user.role,
      subscription: user.subscription ?? "free",
      banned: false,
      banReason: user.banReason ?? null,
    },
    session,
  };
}

/**
 * Resolves the current session from the request cookies.
 *
 * Per-request memoized with cache() so a request that reads the session both
 * in the RoleGate and in the chrome (or on several pages) never pays a second
 * database round-trip.
 *
 * Protected pages bypass the cookie cache so revocation, bans, and role
 * changes take effect on the next request.
 */
export const getSession = cache(async () => {
  const headersList = await headers();

  // Fail closed if the session store is unavailable.
  let dbSession;
  try {
    dbSession = await auth.api.getSession({ headers: headersList, query: { disableCookieCache: true } });
  } catch {
    return null;
  }
  if (!dbSession?.user) return null;

  return mapSession(
    dbSession.user as BaseUser,
    dbSession.session as SessionPayload,
  );
});

/**
 * Layout-level authorization: gate inside each dashboard layout so a role
 * can never reach another role's pages, even if the proxy missed (docs:
 * "handle auth checks in each page/route").
 */
export async function requireRole(allowed: readonly UserRole[]): Promise<{ user: UserSession["user"] }> {
  const session = await getSession();
  if (!session) redirect("/redirect");
  if (!(allowed as readonly string[]).includes(session.user.role)) redirect("/redirect");
  return { user: session.user };
}

/** Maps a user role to its dashboard home path. */
export function roleHome(role: UserRole): string {
  switch (role) {
    case "super-admin":
    case "admin":
      return "/admin/dashboard";
    case "tutor":
      return "/tutors/dashboard";
    case "student":
      return "/students/dashboard";
    default:
      return "/sign-in";
  }
}
