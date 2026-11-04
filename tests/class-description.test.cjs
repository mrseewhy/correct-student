const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers.cjs");

test("class descriptions show readable text and public excerpts do not expose the full body", () => {
  const { classDescriptionText, classDescriptionExcerpt } = loadTs("lib/class-description.ts");
  const document = JSON.stringify([
    { type: "heading", content: [{ type: "text", text: "Welcome", styles: {} }] },
    { type: "paragraph", content: [{ type: "text", text: "A long description for children", styles: {} }] },
  ]);
  assert.equal(classDescriptionText(document), "Welcome\nA long description for children");
  assert.equal(classDescriptionExcerpt(document, 12), "Welcome A lo…");
  assert.equal(classDescriptionText("Plain description"), "Plain description");
});
