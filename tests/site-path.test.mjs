import test from "node:test";
import assert from "node:assert/strict";
import { normalizeBasePath, joinBasePath } from "../src/lib/site.mjs";
test("root and project Pages links keep assets and anchors under the deployment prefix", () => {
  for (const prefix of ["", "/chengrui-portfolio", "/user.github.io"]) {
    assert.equal(joinBasePath("/resume.pdf", prefix), prefix + "/resume.pdf");
    assert.equal(joinBasePath("/#projects", prefix), prefix + "/#projects");
    assert.equal(joinBasePath("/", prefix), prefix + "/");
  }
});
test("external contact and document anchors remain usable", () => {
  for (const value of [
    "mailto:person@example.com",
    "https://github.com/magicuidesign/portfolio",
    "#contact",
    "//example.com/asset",
  ]) {
    assert.equal(joinBasePath(value, "/portfolio"), value);
  }
});
test("normalization rejects an origin, traversal, or malformed deployment prefix", () => {
  assert.equal(normalizeBasePath("/portfolio/"), "/portfolio");
  assert.equal(normalizeBasePath("/"), "");
  for (const value of [
    "https://example.com/portfolio",
    "portfolio",
    "/../secret",
    "/project?query=1",
    "/project#fragment",
    "/a//b",
  ]) {
    assert.throws(() => normalizeBasePath(value));
  }
});
