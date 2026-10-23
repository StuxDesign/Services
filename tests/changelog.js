// Checks that assets/js/changelogs.js renders Date Versioning headings and orders sections.
// Run with: node tests/changelog.js
const fs = require("fs"), path = require("path"), assert = require("assert");
const src = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "changelogs.js"), "utf8");
const els = { "cl-body": { innerHTML: "" }, "cl-version": { textContent: "" } };
const md = "# Changelog\n\n## v26.10.24-1\n\n### Deprecated\n\n- old\n\n### Added\n\n- new\n\n## v26.10.23\n\n### Fixed\n\n- bug\n";
global.document = { getElementById: (id) => els[id] };
global.fetch = (u) => Promise.resolve({ ok: true, text: () => Promise.resolve(u.endsWith("VERSION.md") ? "26.10.24-1\n" : md) });
new Function(src)();
setTimeout(() => {
  const h = els["cl-body"].innerHTML;
  assert(h.includes("<h2>v26.10.24-1</h2>") && h.includes("<h2>v26.10.23</h2>"), "headings");
  assert(h.indexOf("cl-label-added") < h.indexOf("cl-label-deprecated"), "section order");
  assert.strictEqual(els["cl-version"].textContent, "v26.10.24-1");
  console.log("ok   - changelog renderer handles Date Versioning headings");
}, 50);
