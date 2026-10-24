import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createSegmentAliases } from "../scripts/export-utils.mjs";

test("static article segment URLs resolve regardless of exporter path separators", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-export-test-"));
  t.after(() => {
    assert.ok(path.resolve(temporary).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(temporary, { recursive: true, force: true });
  });
  const article = path.join(temporary, "blog", "post");
  const nested = path.join(article, "__next.blog", "$d$slug");
  fs.mkdirSync(nested, { recursive: true });
  fs.writeFileSync(path.join(nested, "__PAGE__.txt"), "article-segment");
  fs.writeFileSync(path.join(article, "__next._full.txt"), "full-rsc");
  assert.equal(createSegmentAliases(temporary), 1);
  assert.equal(
    fs.readFileSync(path.join(article, "__next.blog.$d$slug.__PAGE__.txt"), "utf8"),
    "article-segment",
  );
  assert.equal(fs.readFileSync(path.join(article, "__next._full.txt"), "utf8"), "full-rsc");
});
