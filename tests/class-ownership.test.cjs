const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers.cjs");

test("tutors cannot edit or delete another tutor's class", async () => {
  let writes = 0;
  const { updateTutorClassAction, deleteTutorClassAction } = loadTs("lib/data/actions/classes-admin.ts", {
    "next/cache": { revalidatePath: () => {} },
    "next/navigation": { redirect: (url) => { throw new Error(`REDIRECT:${url}`); } },
    "@/lib/auth/session": { requireRole: async () => ({ user: { id: "tutor-a", role: "tutor" } }) },
    "@/lib/data/dal/classes": {
      getClass: async () => ({ id: "class-1", primaryTutorId: "tutor-a", createdById: "tutor-b" }),
      saveClass: async () => { writes++; }, deleteClass: async () => { writes++; },
    },
    "@/lib": { db: {} },
    "@/lib/schema": { mediaTypesTable: {} },
    "drizzle-orm": { eq: () => null },
    "@/lib/class-description": { classDescriptionText: x => x },
    "@/lib/class-uploads": { youtubeUrl: () => null, uploaded: async () => null, coverImage: async () => null },
  });
  const form = new FormData(); form.set("id", "class-1");
  await assert.rejects(updateTutorClassAction(form), /REDIRECT:\/tutors\/classes$/);
  await assert.rejects(deleteTutorClassAction(form), /REDIRECT:\/tutors\/classes$/);
  assert.equal(writes, 0);
});
