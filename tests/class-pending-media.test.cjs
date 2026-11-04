const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers.cjs");
const completion = loadTs("lib/class-completion.ts", {
  "@/lib/class-description": { classDescriptionText: value => value },
});

test("a class with pending media cannot be marked complete by submitting the action directly", async () => {
  let completions = 0;
  const { completeClassAction } = loadTs("lib/data/actions/class-progress.ts", {
    "next/cache": { revalidatePath: () => {} },
    "next/navigation": { redirect: url => { throw new Error(`REDIRECT:${url}`); } },
    "@/lib/auth/session": { requireRole: async () => ({ user: { id: "student", subscription: "starter" } }) },
    "@/lib/class-completion": completion,
    "@/lib/data/dal/classes": {
      getClass: async () => ({ id: "class", slug: "example", mediaTypeName: "Video", description: "Introduction", materials: [] }),
      canAccessClass: async () => true,
      markClassCompleted: async () => { completions++; return true; },
    },
  });
  const form = new FormData(); form.set("classId", "class");
  await assert.rejects(completeClassAction(form), /REDIRECT:\/students\/classes\/example$/);
  assert.equal(completions, 0);
});

test("a text class with a description can be completed after starting", async () => {
  let completions = 0;
  const { completeClassAction } = loadTs("lib/data/actions/class-progress.ts", {
    "next/cache": { revalidatePath: () => {} },
    "next/navigation": { redirect: url => { throw new Error(`REDIRECT:${url}`); } },
    "@/lib/auth/session": { requireRole: async () => ({ user: { id: "student", subscription: "starter" } }) },
    "@/lib/class-completion": completion,
    "@/lib/data/dal/classes": {
      getClass: async () => ({ id: "class", slug: "text-lesson", mediaTypeName: "Text", description: "Read this lesson", materials: [] }),
      canAccessClass: async () => true,
      markClassCompleted: async () => { completions++; return true; },
    },
  });
  const form = new FormData(); form.set("classId", "class");
  await assert.rejects(completeClassAction(form), /REDIRECT:\/students\/classes\/text-lesson$/);
  assert.equal(completions, 1);
});

test("the completion rule requires matching media for audio and video", () => {
  assert.equal(completion.hasCompletableContent({ mediaTypeName: "Audio", description: "Intro", materials: [{ kind: "pdf" }] }), false);
  assert.equal(completion.hasCompletableContent({ mediaTypeName: "Video", description: "Intro", materials: [{ kind: "youtube" }] }), true);
  assert.equal(completion.hasCompletableContent({ mediaTypeName: "Text", description: "Lesson", materials: [] }), true);
});
