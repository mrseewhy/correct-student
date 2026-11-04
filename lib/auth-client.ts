import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields, usernameClient } from "better-auth/client/plugins";

import type { auth } from "@/lib/auth";
import { ac, rolesMap } from "@/lib/auth/permissions";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
    adminClient({
      ac,
      roles: rolesMap,
    }),
  ],
});

/** Shape of the session returned by better-auth on the server. */
export type AuthSession = typeof auth.$Infer.Session;
