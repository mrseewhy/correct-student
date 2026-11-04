import "server-only";

import { desc, eq, ilike, or, and, sql } from "drizzle-orm";
import { db } from "@/lib";
import { userTable } from "@/lib/schema";
import type { AuthRole as UserRole, SubscriptionPlan } from "@/lib/schema";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  displayUsername: string | null;
  role: UserRole;
  subscription: SubscriptionPlan;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserFilters = {
  search?: string;
  ban?: "all" | "active" | "banned";
  plan?: "all" | "free" | "starter" | "plus" | "premium";
};

function userWhere(role: UserRole | UserRole[], filters: UserFilters) {
  const roles = Array.isArray(role) ? role : [role];
  const conditions = [sql`${userTable.role} IN (${sql.join(roles.map((r) => sql`${r}`), sql`, `)})`];
  const search = filters.search?.trim();
  if (search) {
    const like = `%${search}%`;
    const searchCondition = or(
      ilike(userTable.name, like),
      ilike(userTable.email, like),
      ilike(userTable.username, like),
    );
    if (searchCondition) conditions.push(searchCondition);
  }
  if (filters.ban === "active") conditions.push(eq(userTable.banned, false));
  if (filters.ban === "banned") conditions.push(eq(userTable.banned, true));
  if (filters.plan && filters.plan !== "all") conditions.push(eq(userTable.subscription, filters.plan));
  return and(...conditions);
}

export async function listManagedUsers(role: UserRole | UserRole[], filters: UserFilters = {}, limit = 10, offset = 0): Promise<ManagedUser[]> {
  const rows = await db.select().from(userTable).where(userWhere(role, filters)).orderBy(desc(userTable.createdAt)).limit(limit).offset(offset);
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    username: row.username,
    displayUsername: row.displayUsername ?? null,
    role: row.role as UserRole,
    subscription: row.subscription as SubscriptionPlan,
    banned: row.banned,
    banReason: row.banReason ?? null,
    banExpires: row.banExpires ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
}

export async function countManagedUsers(role: UserRole | UserRole[], filters: UserFilters = {}): Promise<number> {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(userTable).where(userWhere(role, filters));
  return row?.count ?? 0;
}

export async function getUserById(id: string): Promise<ManagedUser | null> {
  const [row] = await db.select().from(userTable).where(eq(userTable.id, id));
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    username: row.username,
    displayUsername: row.displayUsername ?? null,
    role: row.role as UserRole,
    subscription: row.subscription as SubscriptionPlan,
    banned: row.banned,
    banReason: row.banReason ?? null,
    banExpires: row.banExpires ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
