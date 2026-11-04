// Role and permission model — shared by the server auth config and the auth client.
//
// Roles are a closed, never-user-editable set:
//   student, tutor, admin, super-admin
// Only super-admins may change roles or delete users.

import { createAccessControl } from "better-auth/plugins/access";

export type UserRole = "student" | "tutor" | "admin" | "super-admin";

/** Roles a visitor may pick for themselves on the get-started page. */
export const selfServiceRoles = ["student", "tutor"] as const satisfies readonly UserRole[];

const statements = {
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
    "set-email",
    "get",
    "update",
  ],
  session: ["list", "revoke", "delete"],
} as const;

export const ac = createAccessControl(statements);

/** Tutors/students: no privileged matches operations. */
export const memberRole = ac.newRole({
  user: [],
  session: [],
});

/** Admin: user management without role changes or deletion. */
export const adminRole = ac.newRole({
  user: ["create", "list", "ban", "impersonate", "set-password", "set-email", "get", "update"],
  session: ["list", "revoke", "delete"],
});

/** Super-admin: everything, including set-role = manage admins. */
export const superAdminRole = ac.newRole({
  user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "set-email", "get", "update"],
  session: ["list", "revoke", "delete"],
});

export const rolesMap = {
  "student": memberRole,
  "tutor": memberRole,
  "admin": adminRole,
  "super-admin": superAdminRole,
} as const;

export const adminRoles: UserRole[] = ["admin", "super-admin"];

/** Roles allowed to be stored in the user.role column. */
export const assignableRoles: readonly UserRole[] = ["student", "tutor", "admin", "super-admin"];

export function isRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (assignableRoles as readonly string[]).includes(value)
  );
}
