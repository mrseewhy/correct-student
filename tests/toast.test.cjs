const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers.cjs");

test("server action feedback is stored as a short-lived, readable toast", async () => {
  let written;
  const store = {
    set: (name, value, options) => { written = { name, value, options }; },
    get: () => written && { value: written.value },
  };
  const { flashToast, readToast, TOAST_COOKIE } = loadTs("lib/toast.ts", {
    "server-only": {},
    "next/headers": { cookies: async () => store },
  });

  await flashToast("success", "Class saved.");
  assert.equal(written.name, TOAST_COOKIE);
  assert.equal(written.options.path, "/");
  assert.equal(written.options.maxAge, 30);
  assert.deepEqual(await readToast(), JSON.parse(written.value));

  written.value = "invalid";
  assert.equal(await readToast(), null);
});
