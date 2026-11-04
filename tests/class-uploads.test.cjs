const test = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./helpers.cjs");

const { youtubeUrl, uploaded, coverImage } = loadTs("lib/class-uploads.ts");
const file = (bytes, name, type) => new File([bytes], name, { type });

test("YouTube links are validated and normalized", () => {
  assert.equal(youtubeUrl("https://youtu.be/abcdefghijk"), "https://www.youtube.com/watch?v=abcdefghijk");
  assert.equal(youtubeUrl(""), null);
  assert.throws(() => youtubeUrl("http://youtu.be/abcdefghijk"));
  assert.throws(() => youtubeUrl("https://example.com/watch?v=abcdefghijk"));
  assert.throws(() => youtubeUrl("https://youtu.be/short"));
});

test("PDF and audio uploads validate content rather than declared MIME", async () => {
  assert.equal(await uploaded(null, "pdf"), null);
  assert.equal((await uploaded(file("%PDF-1.4", "lesson.pdf", "text/plain"), "pdf")).mimeType, "application/pdf");
  assert.equal((await uploaded(file("ID3audio", "lesson.mp3", "application/octet-stream"), "audio")).mimeType, "audio/mpeg");
  await assert.rejects(uploaded(file("not a PDF", "fake.pdf", "application/pdf"), "pdf"));
  await assert.rejects(uploaded(file("not audio", "fake.mp3", "audio/mpeg"), "audio"));
  await assert.rejects(uploaded(file(Buffer.alloc(3_000_001), "large.pdf", "application/pdf"), "pdf"));
});

test("cover image preserves the old image and rejects spoofed or oversized files", async () => {
  assert.equal(await coverImage(null, "old-image"), "old-image");
  assert.match(await coverImage(file(Buffer.from([137,80,78,71,13,10,26,10]), "cover.png", "text/plain"), null), /^data:image\/png;base64,/);
  await assert.rejects(coverImage(file("fake image", "cover.png", "image/png"), null));
  await assert.rejects(coverImage(file(Buffer.alloc(2_000_001), "large.png", "image/png"), null));
});
