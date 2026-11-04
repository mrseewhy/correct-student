// Run against an isolated migrated database with TEST_DATABASE_URL set.
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");

if (!process.env.TEST_DATABASE_URL) throw new Error("Set TEST_DATABASE_URL to an isolated migrated database.");
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const root = path.resolve(__dirname, "..");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  if (request.startsWith("@/")) request = path.join(root, request.slice(2));
  return resolve.call(this, request, parent, ...rest);
};
let session = null;
const load = Module._load;
Module._load = function (request, parent, ...rest) {
  if (request === "server-only") return {};
  if (request === "@/lib/auth/session") return { getSession: async () => session };
  return load.call(this, request, parent, ...rest);
};
require.extensions[".ts"] = (mod, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, { fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  mod._compile(output, filename);
};

const { Pool } = require("pg");
const { db } = require("../lib/index.ts");
const { canAccessClass, saveClass, getClass, markClassStarted, markClassCompleted, studentClassProgress, deleteClass } = require("../lib/data/dal/classes.ts");
const { GET: getMaterial } = require("../app/api/classes/materials/[id]/route.ts");
const { eq } = require("drizzle-orm");
const { userTable, languagesTable, contentTypesTable, mediaTypesTable, levelsTable, pricingPlansTable } = require("../lib/schema.ts");
const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
const prefix = `test-${Date.now()}`;
const ids = { tutor: `${prefix}-tutor`, student1: `${prefix}-student-1`, student2: `${prefix}-student-2` };
let classId;
const fixtureIds = [];

async function fixture(table, values) {
  const [row] = await db.insert(table).values(values).returning();
  fixtureIds.push([table, row.id]);
  return row;
}
async function run() {
  const language = await fixture(languagesTable, { name: prefix, code: prefix });
  const type = await fixture(contentTypesTable, { name: prefix });
  const media = await fixture(mediaTypesTable, { name: "Text" });
  const level = await fixture(levelsTable, { name: prefix });
  const plans = await db.select().from(pricingPlansTable);
  const starter = plans.find(x => x.planKey === "starter");
  assert.ok(media && starter && plans.length >= 4);
  for (const [id, role, subscription] of [[ids.tutor,"tutor","free"],[ids.student1,"student","starter"],[ids.student2,"student","premium"]]) {
    await db.insert(userTable).values({ id, name: id, email: `${id}@example.invalid`, username: id, role, subscription });
  }
  classId = await saveClass({ slug: prefix, title: "Integration class", description: "A full description", durationMinutes: 10, coverImage: null,
    languageId: language.id, contentTypeId: type.id, mediaTypeId: media.id, levelId: level.id, primaryTutorId: ids.tutor,
    status: "published", planIds: [starter.id], tutorIds: [], outcomes: [], outline: [], materials: [{ kind: "pdf", content: Buffer.from("%PDF-1.4").toString("base64"), mimeType: "application/pdf", filename: "lesson.pdf" }] });
  assert.equal((await getClass(classId)).status, "published");
  let materialId = (await getClass(classId)).materials[0].id;
  const materialRequest = new Request(`http://localhost/api/classes/materials/${materialId}`);
  const materialParams = () => ({ params: Promise.resolve({ id: materialId }) });
  assert.equal((await getMaterial(materialRequest, materialParams())).status, 401);
  session = { user: { id: ids.student1, role: "student", subscription: "starter" } };
  assert.equal((await getMaterial(materialRequest, materialParams())).status, 403, "start is required");
  for (let mask = 1; mask < 16; mask++) {
    const allowed = ["free", "starter", "plus", "premium"].filter((_, index) => mask & (1 << index));
    await saveClass({ slug: prefix, title: "Integration class", description: "A full description", durationMinutes: 10, coverImage: null,
      languageId: language.id, contentTypeId: type.id, mediaTypeId: media.id, levelId: level.id, primaryTutorId: ids.tutor,
      status: "published", planIds: plans.filter(x => allowed.includes(x.planKey)).map(x => x.id), tutorIds: [], outcomes: [], outline: [], materials: [{ kind: "pdf", content: Buffer.from("%PDF-1.4").toString("base64"), mimeType: "application/pdf", filename: "lesson.pdf" }] }, classId);
    for (const plan of plans) assert.equal(await canAccessClass(classId, plan.planKey), allowed.includes(plan.planKey), `${allowed.join(",")} versus ${plan.planKey}`);
  }
  assert.equal(await markClassCompleted(ids.student1, classId), false);
  await markClassStarted(ids.student1, classId);
  // The plan matrix rewrites materials, so use the current material ID.
  materialId = (await getClass(classId)).materials[0].id;
  assert.equal((await getMaterial(materialRequest, materialParams())).status, 200, "eligible starter can fetch after starting");
  assert.equal(await markClassCompleted(ids.student1, classId), true);
  assert.ok((await studentClassProgress(ids.student1, classId)).completedAt);
  assert.equal(await studentClassProgress(ids.student2, classId), null);
  await markClassStarted(ids.student2, classId);
  assert.equal((await studentClassProgress(ids.student2, classId)).completedAt, null);
  await saveClass({ slug: prefix, title: "Integration class", description: "A full description", durationMinutes: 10, coverImage: null,
    languageId: language.id, contentTypeId: type.id, mediaTypeId: media.id, levelId: level.id, primaryTutorId: ids.tutor,
    status: "published", planIds: [plans.find(x => x.planKey === "premium").id], tutorIds: [], outcomes: [], outline: [], materials: [{ kind: "pdf", content: Buffer.from("%PDF-1.4").toString("base64"), mimeType: "application/pdf", filename: "lesson.pdf" }] }, classId);
  assert.equal(await canAccessClass(classId, "starter"), false);
  assert.equal(await canAccessClass(classId, "premium"), true);
  assert.ok((await studentClassProgress(ids.student1, classId)).completedAt, "completion survives plan changes");
  materialId = (await getClass(classId)).materials[0].id;
  assert.equal((await getMaterial(materialRequest, materialParams())).status, 403, "a removed plan cannot fetch content");
  session = { user: { id: ids.student2, role: "student", subscription: "premium" } };
  materialId = (await getClass(classId)).materials[0].id;
  assert.equal((await getMaterial(materialRequest, materialParams())).status, 200);
  console.log("Database class plan matrix and per-student progress passed.");
}
run().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (classId) await deleteClass(classId);
  for (const id of Object.values(ids)) await db.delete(userTable).where(eq(userTable.id, id));
  for (const [table, id] of fixtureIds.reverse()) await db.delete(table).where(eq(table.id, id));
  await pool.end();
  await globalThis.databasePool?.end();
});
