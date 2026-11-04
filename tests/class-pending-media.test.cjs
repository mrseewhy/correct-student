const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers.cjs");

test("a class with pending media cannot be marked complete by submitting the action directly", async () => {
  let completions = 0;
  const { completeClassAction } = loadTs("lib/data/actions/class-progress.ts", {
    "next/cache": { revalidatePath: () => {} },
    "next/navigation": { redirect: url => { throw new Error(`REDIRECT:${url}`); } },
    "@/lib/auth/session": { requireRole: async () => ({ user: { id: "student", subscription: "starter" } }) },
    "@/lib/data/dal/classes": {
      getClass: async () => ({ id: "class", slug: "example", materials: [] }),
      canAccessClass: async () => true,
      markClassCompleted: async () => { completions++; return true; },
    },
  });
  const form = new FormData(); form.set("classId", "class");
  await assert.rejects(completeClassAction(form), /REDIRECT:\/students\/classes\/example$/);
  assert.equal(completions, 0);
});
