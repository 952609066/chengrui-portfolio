import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const root = process.cwd();
const info = JSON.parse(fs.readFileSync("out/build-info.json", "utf8"));
const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const homepage = `${origin}${info.basePath}/`;
const resultDir = path.join(root, "test-results");
const suffix = info.basePath ? "project-path" : "root";
const checks = [];
const failures = [];
fs.mkdirSync(resultDir, { recursive: true });
const preview = spawn(process.execPath, ["scripts/preview.mjs", `--port=${port}`], {
  cwd: root,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let previewOutput = "";
preview.stdout.on("data", (data) => (previewOutput += data));
preview.stderr.on("data", (data) => (previewOutput += data));
let browser;

try {
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      if ((await fetch(homepage)).ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (attempt === 39) throw new Error(`Preview failed: ${previewOutput}`);
  }
  const installed = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].find((file) => file && fs.existsSync(file));
  browser = await chromium.launch({
    ...(installed ? { executablePath: installed } : {}),
    headless: true,
    args: ["--no-first-run", "--disable-extensions"],
  });

  for (const [mode, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
      locale: "zh-CN",
    });
    const page = await context.newPage();
    const pageErrors = [];
    const failedResources = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(origin) && response.status() >= 400) {
        failedResources.push(`${response.status()} ${response.url()}`);
      }
    });

    assert.equal((await page.goto(homepage, { waitUntil: "networkidle" })).status(), 200);
    assert.match(await page.locator("h1").innerText(), /袁成睿/);
    assert.equal(await page.locator(".magic-project").count(), 6);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2),
      true,
      `${mode}: no horizontal overflow`,
    );
    await page.getByRole("button", { name: "多模态", exact: true }).click();
    assert.equal(await page.locator(".magic-project").count(), 2);
    await page.getByRole("button", { name: "全部", exact: true }).click();
    await page.locator("details summary").first().click();
    assert.match(await page.locator("details").first().innerText(), /477/);
    await page.locator("details summary").first().click();
    const brokenImages = await page.locator("img").evaluateAll(async (images) => {
      await Promise.all(images.map((image) => image.decode().catch(() => {})));
      return images.filter((image) => image.naturalWidth === 0).map((image) => image.src);
    });
    assert.deepEqual(brokenImages, []);
    const assetPaths = await page
      .locator("img")
      .evaluateAll((images) => images.map((i) => new URL(i.src).pathname));
    assert.equal(
      assetPaths.every((value) => value.startsWith(`${info.basePath}/assets/`)),
      true,
    );
    const resumeLink = page.getByRole("link", { name: "下载简历", exact: true });
    assert.equal(await resumeLink.getAttribute("href"), `${info.basePath}/resume.pdf`);
    assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /index/);
    if (info.siteUrl) {
      assert.equal(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
        `${info.siteUrl}/`,
      );
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(resultDir, `${suffix}-${mode}.png`), fullPage: true });
    await page.getByRole("button", { name: "切换明暗主题", exact: true }).click();
    assert.equal(await page.locator("html").evaluate((el) => el.classList.contains("dark")), true);
    await page.getByRole("button", { name: "切换明暗主题", exact: true }).click();

    await page.getByRole("link", { name: "工程复盘", exact: true }).click();
    await page.waitForLoadState("networkidle");
    assert.equal(new URL(page.url()).pathname, `${info.basePath}/blog/`);
    assert.equal(await page.locator("main article").count(), 2);
    await page.getByRole("link", { name: "测量一次推理，还是一条系统链路？", exact: true }).click();
    await page.waitForLoadState("networkidle");
    await page.waitForURL(`${origin}${info.basePath}/blog/measuring-inference/`);
    assert.equal(new URL(page.url()).pathname, `${info.basePath}/blog/measuring-inference/`);
    assert.match(await page.locator("main article").innerText(), /51\.88/);
    await page.getByRole("link", { name: "返回工程复盘", exact: true }).click();
    await page.waitForLoadState("networkidle");
    await page.getByRole("link", { name: "首页", exact: true }).click();
    await page.waitForLoadState("networkidle");
    assert.equal(new URL(page.url()).pathname, `${info.basePath}/`);

    await page.goto(`${homepage}resume.html`, { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("button", { name: "打印 / 保存为 PDF" }).count(), 1);
    const pdfHref = await page
      .getByRole("link", { name: "下载简历 PDF", exact: true })
      .getAttribute("href");
    const pdf = await context.request.get(new URL(pdfHref, page.url()).href);
    assert.equal(pdf.status(), 200);
    assert.equal((await pdf.body()).subarray(0, 4).toString(), "%PDF");
    if (mode === "desktop") {
      await page.emulateMedia({ media: "print" });
      await page.pdf({
        path: path.join(resultDir, `${suffix}-resume.pdf`),
        format: "A4",
        printBackground: true,
        margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
      });
    }
    const missing = await context.request.get(`${homepage}this-page-does-not-exist/`);
    assert.equal(missing.status(), 404);
    assert.deepEqual(pageErrors, [], `${mode}: no browser script errors`);
    assert.deepEqual(failedResources, [], `${mode}: no missing resources`);
    checks.push(
      `${suffix} ${mode}: content, responsive layout, filtering, images, theme, blog navigation, resume, 404 PASS`,
    );
    await context.close();
  }

  const robots = await fetch(`${homepage}robots.txt`);
  assert.equal(robots.status, 200);
  if (info.siteUrl) {
    assert.match(await robots.text(), /Sitemap:/);
    const sitemap = await fetch(`${homepage}sitemap.xml`);
    assert.equal(sitemap.status, 200);
    assert.equal(
      (await sitemap.text()).includes(`${info.siteUrl}/blog/measuring-inference/`),
      true,
    );
  }
  checks.push(`${suffix}: robots and deployment-aware sitemap PASS`);
} catch (error) {
  failures.push(error.stack || error.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  preview.kill();
  const result = {
    date: "2026-10-24",
    basePath: info.basePath,
    siteUrl: info.siteUrl,
    checks,
    failures,
  };
  fs.writeFileSync(
    path.join(resultDir, `verification-${suffix}.json`),
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
}
