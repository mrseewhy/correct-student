// Next.js 16 request gateway (middleware renamed to proxy).
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
//
// Optimistic cookie-only routing per the better-auth Next.js guide — the
// session cookie is NOT validated here. Every dashboard layout re-checks the
// real session and its role, so no role can land on another role's pages.

import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const DASHBOARD_PREFIXES = ["/admin", "/students", "/tutors"];
const LEGACY_PREFIXES = ["/student", "/tutor"];
const DASHBOARD_ENTRY: Record<string, string> = {
  "/students": "/students/dashboard",
  "/tutors": "/tutors/dashboard",
  "/admin": "/admin/dashboard",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (LEGACY_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.redirect(new URL("/redirect", request.url));
  }

  const isDashboard = DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Dashboard entry goes through the server-side role gateway.
  if (!hasSessionCookie && isDashboard) {
    return NextResponse.redirect(new URL("/redirect", request.url));
  }

  // These are direction hints only. The destination layout verifies the
  // current session and role before rendering dashboard content.
  const entry = DASHBOARD_ENTRY[pathname];
  if (entry) return NextResponse.redirect(new URL(entry, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Everything except API routes, Next internals and static assets.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)",
  ],
};
