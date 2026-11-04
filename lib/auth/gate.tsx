import "server-only";

// Auth gate for dashboard layouts.
//
// Under cacheComponents the session read must sit inside a <Suspense>
// boundary (docs: "Keep the session read out of a layout's top level").
//
// This component takes SERVER COMPONENT children as plain React nodes —
// never a render-prop function. Passing a function as children to an async
// server component crashes the prerender pass when the gate redirects an
// unauthorized role (React tries to serialize the children slot).
// Layouts that need the user render an inner async server component below
// the gate, which re-reads the (per-request memoized) session.

import { requireRole } from "@/lib/auth/session";
import type { UserRole } from "@/lib/auth/permissions";

export async function RoleGate({
  allowed,
  children,
}: {
  allowed: readonly UserRole[];
  children: React.ReactNode;
}) {
  await requireRole(allowed);
  return children;
}
