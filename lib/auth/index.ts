// Server-side Better Auth instance.
// Docs: https://better-auth.com/docs/installation

import { APIError, betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, username } from "better-auth/plugins";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { db } from "@/lib";
import {
  accountTable,
  sessionTable,
  userTable,
  verificationTable,
} from "@/lib/schema";
import {
  ac,
  adminRoles,
  rolesMap,
  selfServiceRoles,
  type UserRole,
} from "@/lib/auth/permissions";
import { rateLimiter } from "@/lib/security/ratelimit";

function signupUserRole(value: unknown): Extract<UserRole, "student" | "tutor"> {
  const role = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!(selfServiceRoles as readonly string[]).includes(role)) {
    throw new APIError("BAD_REQUEST", { message: "Choose student or tutor to register." });
  }
  return role as Extract<UserRole, "student" | "tutor">;
}

/** Per-IP budget for the public credential endpoints (see lib/security/ratelimit.ts). */
const limitedAuthPaths = {
  "/sign-in/email": "login",
  "/sign-in/username": "login",
  "/sign-up/email": "register",
} as const;

function retryAfterText(retryAfter: number) {
  const wait = Math.max(1, Math.ceil(retryAfter));
  if (wait < 60) return `${wait} second${wait === 1 ? "" : "s"}`;
  const minutes = Math.ceil(wait / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
    },
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  session: {
    // Better Auth may cache session data for other clients. Protected dashboard
    // reads explicitly bypass this cache in lib/auth/session.ts.
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },

  user: {
    additionalFields: {
      // Only server code may assign a plan. The default applies at signup.
      subscription: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
    },
  },

  plugins: [
    username({
      immutableUsername: true,
      usernameValidator: (value) => /^[a-zA-Z0-9._-]{3,30}$/.test(value),
    }),

    admin({
      ac,
      roles: rolesMap,
      adminRoles,
      defaultRole: "student",
    }),

    // Must stay last so cookies from server-action API calls get set.
    nextCookies(),
  ],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const action = limitedAuthPaths[ctx.path as keyof typeof limitedAuthPaths];
      if (!action) return;

      // Rate limits fail closed (see lib/security/client-ip.ts), including
      // production behind a proxy that does not set a trusted client IP —
      // the same trade-off the public forms already make.
      // Requests through the HTTP handler always carry headers. Server-side
      // calls must pass them explicitly (as the admin server actions do).
      const headers = ctx.headers ?? new Headers();
      const limit = await rateLimiter(action, headers);
      if (limit.allowed) return;

      const message =
        limit.reason === "unavailable"
          ? action === "register"
            ? "Registration is temporarily unavailable. Please try again shortly."
            : "Sign-in is temporarily unavailable. Please try again shortly."
          : `Too many attempts. Try again in ${retryAfterText(limit.retryAfter)} or contact support if you're locked out.`;
      throw new APIError("TOO_MANY_REQUESTS", { message });
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const body = (ctx?.body ?? {}) as {
            signupRole?: unknown;
            role?: unknown;
            subscription?: unknown;
          };
          if (ctx?.path === "/sign-up/email") {
            // The public endpoint accepts only explicit student/tutor choices.
            // Never trust a submitted role or subscription field directly.
            // Only the free plan can be self-assigned; paid plans require payment.
            const role = signupUserRole(body.signupRole);
            return { data: {
              ...user,
              role,
              subscription: "free",
            } };
          }
          if (ctx?.path === "/admin/create-user") {
            // Better Auth has already checked create and set-role permissions.
            // Preserve its validated role and give staff no paid subscription.
            return { data: { ...user, subscription: "free" } };
          }
          return { data: user };
        },
      },
    },
  },
});
