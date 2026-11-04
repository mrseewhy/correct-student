import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";

import { getSession, roleHome } from "@/lib/auth/session";

export default async function RedirectPage() {
  // Never statically prerender this — the destination depends on the request's
  // session cookie. unstable_noStore() opts out of static prerendering without
  // using route segment config (which is incompatible with cacheComponents).
  unstable_noStore();

  const session = await getSession();

  // Not authenticated → send to sign-in
  if (!session) {
    redirect("/sign-in");
  }

  // Authenticated → route to the correct dashboard home by role
  redirect(roleHome(session.user.role));
}
