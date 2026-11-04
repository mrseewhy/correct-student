const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers.cjs");

test("only super admins can use Better Auth's direct delete permission", () => {
  const { adminRole, superAdminRole } = loadTs("lib/auth/permissions.ts");
  assert.equal(adminRole.statements.user.includes("delete"), false);
  assert.equal(superAdminRole.statements.user.includes("delete"), true);
  assert.equal(adminRole.statements.user.includes("set-role"), false);
});

test("cron cleanup fails closed when its secret is missing or wrong", async () => {
  let cleaned = 0;
  const { GET } = loadTs("app/api/cron/cleanup-rate-limits/route.ts", {
    "@/lib/security/ratelimit": { cleanupExpiredRateLimits: async () => { cleaned++; } },
  });
  const previous = process.env.CRON_SECRET;
  try {
    delete process.env.CRON_SECRET;
    assert.equal((await GET(new Request("http://localhost/api/cron/cleanup-rate-limits"))).status, 503);
    process.env.CRON_SECRET = "test-secret";
    assert.equal((await GET(new Request("http://localhost/api/cron/cleanup-rate-limits"))).status, 401);
    assert.equal(cleaned, 0);
    const authorized = new Request("http://localhost/api/cron/cleanup-rate-limits", {
      headers: { authorization: "Bearer test-secret" },
    });
    assert.equal((await GET(authorized)).status, 200);
    assert.equal(cleaned, 1);
  } finally {
    if (previous === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previous;
  }
});

test("class completion updates existing progress and never inserts it", async () => {
  let existing = false;
  let insertCalls = 0;
  const db = {
    update: () => ({ set: () => ({ where: () => ({ returning: async () => existing ? [{ classId: "class" }] : [] }) }) }),
    insert: () => { insertCalls++; throw new Error("Unexpected insert"); },
  };
  const field = { studentId: "studentId", classId: "classId" };
  const { markClassCompleted } = loadTs("lib/data/dal/classes.ts", {
    "server-only": {},
    "drizzle-orm": { and: (...parts) => parts, eq: (...parts) => parts },
    "@/lib": { db },
    "@/lib/constants": { PLATFORM_TUTOR_ID: "platform" },
    "@/lib/schema": { studentClassesTable: field },
  });
  assert.equal(await markClassCompleted("student", "class"), false);
  existing = true;
  assert.equal(await markClassCompleted("student", "class"), true);
  assert.equal(insertCalls, 0);
});

test("an admin creates a tutor without Better Auth's set-role permission", async () => {
  let savedRole;
  const { createTutorAction } = loadTs("lib/data/actions/users-admin.ts", {
    "next/navigation": { redirect: (url) => { throw new Error(`REDIRECT:${url}`); } },
    "next/cache": { revalidatePath: () => {} },
    "next/headers": { headers: async () => new Headers() },
    "@/lib/auth": { auth: { api: { createUser: async ({ body }) => {
      assert.equal(Object.hasOwn(body, "role"), false);
      return { user: { id: "new-user" } };
    } } } },
    "@/lib/auth/session": {
      requireRole: async () => ({ user: { id: "admin", role: "admin" } }),
      getSession: async () => ({ user: { id: "admin", role: "admin" } }),
    },
    "@/lib": { db: { update: () => ({ set: (values) => {
      savedRole = values.role;
      return { where: async () => {} };
    } }) } },
    "@/validation/staff": { staffSchema: { safeParse: () => ({ success: true, data: {
      name: "Tutor", username: "tutor", email: "tutor@example.com", password: "password123",
    } }) } },
    "@/lib/schema": { userTable: { id: "id" } },
    "drizzle-orm": { eq: () => true },
    "@/lib/data/dal/users": {},
    "@/lib/data/dal/classes": { PLATFORM_TUTOR_ID: "platform" },
  });
  await assert.rejects(createTutorAction({}, new FormData()), /REDIRECT:\/admin\/tutors/);
  assert.equal(savedRole, "tutor");
});

test("public signup cannot choose a paid plan or administrator role", async () => {
  let options;
  const { auth } = loadTs("lib/auth/index.ts", {
    "better-auth": { betterAuth: (value) => { options = value; return value; }, APIError: Error },
    "better-auth/api": { createAuthMiddleware: (handler) => handler },
    "better-auth/next-js": { nextCookies: () => ({}) },
    "better-auth/plugins": { username: () => ({}), admin: () => ({}) },
    "@better-auth/drizzle-adapter": { drizzleAdapter: () => ({}) },
    "@/lib": { db: {} },
    "@/lib/schema": {},
    "@/lib/auth/permissions": {
      ac: {}, adminRoles: ["admin", "super-admin"], rolesMap: {}, selfServiceRoles: ["student", "tutor"],
    },
    "@/lib/security/ratelimit": { rateLimiter: async () => ({ allowed: true }) },
  });
  assert.equal(auth, options);
  const before = options.databaseHooks.user.create.before;
  const created = await before({ name: "Learner", role: "admin", subscription: "premium" }, {
    path: "/sign-up/email", body: { signupRole: "student", role: "admin", subscription: "premium" },
  });
  assert.equal(created.data.role, "student");
  assert.equal(created.data.subscription, "free");
  await assert.rejects(before({}, { path: "/sign-up/email", body: { signupRole: "admin" } }));
});

test("class materials require a student with class access and started progress", async () => {
  let session = null;
  let access = false;
  let started = false;
  const material = { id: "material", classId: "class", kind: "pdf", content: Buffer.from("%PDF-").toString("base64"), mimeType: "application/pdf" };
  const { GET } = loadTs("app/api/classes/materials/[id]/route.ts", {
    "drizzle-orm": { eq: () => true },
    "@/lib": { db: { select: () => ({ from: () => ({ where: async () => [material] }) }) } },
    "@/lib/schema": { classMaterialsTable: { id: "id" } },
    "@/lib/auth/session": { getSession: async () => session },
    "@/lib/data/dal/classes": {
      canAccessClass: async () => access,
      studentClassProgress: async () => started ? { studentId: "student" } : null,
    },
  });
  const params = { params: Promise.resolve({ id: "material" }) };
  const request = new Request("http://localhost/api/classes/materials/material");
  assert.equal((await GET(request, params)).status, 401);
  session = { user: { id: "student", role: "student", subscription: "free" } };
  assert.equal((await GET(request, params)).status, 403);
  access = true;
  assert.equal((await GET(request, params)).status, 403);
  started = true;
  const response = await GET(request, params);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
});

test("an admin cannot promote a user through the update action", async () => {
  let writes = 0;
  const { updateUserAction } = loadTs("lib/data/actions/users-admin.ts", {
    "next/navigation": { redirect: (url) => { throw new Error(`REDIRECT:${url}`); } },
    "next/cache": { revalidatePath: () => {} },
    "next/headers": { headers: async () => new Headers() },
    "@/lib/auth": { auth: {} },
    "@/lib/auth/session": {
      requireRole: async () => ({ user: { id: "admin", role: "admin" } }),
      getSession: async () => ({ user: { id: "admin", role: "admin" } }),
    },
    "@/lib": { db: { update: () => { writes++; throw new Error("Unexpected write"); } } },
    "@/validation/staff": {},
    "@/lib/schema": {},
    "drizzle-orm": {},
    "@/lib/data/dal/users": { getUserById: async () => ({ id: "student", role: "student", subscription: "free" }) },
    "@/lib/data/dal/classes": { PLATFORM_TUTOR_ID: "platform" },
  });
  const form = new FormData();
  for (const [key, value] of Object.entries({
    id: "student", targetRole: "student", role: "admin", subscription: "free",
    name: "Student", email: "student@example.com", username: "student",
  })) form.set(key, value);
  await assert.rejects(updateUserAction(form), /Only%20super-admins%20can%20change%20roles/);
  assert.equal(writes, 0);
});
