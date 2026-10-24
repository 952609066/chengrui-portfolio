import { createSegmentAliases } from "./export-utils.mjs";
import fs from "node:fs";
import path from "node:path";
import { basePath, siteUrl } from "../src/lib/site.mjs";
const root = path.resolve("out");
if (!fs.existsSync(path.join(root, "index.html"))) throw new Error("Missing static export");
console.log(`Normalized ${createSegmentAliases(root)} static segment paths`);
fs.writeFileSync(path.join(root, ".nojekyll"), "");
fs.writeFileSync(
  path.join(root, "build-info.json"),
  JSON.stringify({ basePath, siteUrl }, null, 2) + "\n",
);
let robots = "User-agent: *\nAllow: /\n";
if (siteUrl) {
  const posts = fs
    .readdirSync("content")
    .filter((n) => n.endsWith(".mdx"))
    .map((n) => "/blog/" + n.slice(0, -4) + "/");
  const urls = ["/", "/blog/", ...posts]
    .map((p) => `<url><loc>${(siteUrl + p).replace(/&/g, "&amp;")}</loc></url>`)
    .join("");
  fs.writeFileSync(
    path.join(root, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
  );
  robots += `Sitemap: ${siteUrl}/sitemap.xml\n`;
}
fs.writeFileSync(path.join(root, "robots.txt"), robots);
console.log(`Static export ready (basePath=${basePath || "/"})`);
