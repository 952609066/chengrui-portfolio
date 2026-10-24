import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const profile = JSON.parse(fs.readFileSync(path.join(root, "src/data/profile.json"), "utf8"));
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const list = (items) => `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;
const education = profile.education
  .map(
    (e) =>
      `<article><div class="row"><h3>${escape(e.school)} · ${escape(e.degree)}</h3><span>${escape(e.dates)}</span></div><p>${escape(e.detail)}</p></article>`,
  )
  .join("");
const work = profile.experience
  .map(
    (e) =>
      `<article><div class="row"><h3>${escape(e.company)} · ${escape(e.role)}</h3><span>${escape(e.dates)}</span></div>${list(e.bullets)}</article>`,
  )
  .join("");
const projects = profile.projects
  .slice(0, 5)
  .map(
    (p) =>
      `<article><div class="row"><h3>${escape(p.title)}</h3><span>${escape(p.dates)}</span></div><p class="stack">${p.stack.map(escape).join(" / ")}</p>${list(p.bullets)}<p>${escape(p.evidence)}</p></article>`,
  )
  .join("");
const document = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(profile.name)} · 简历</title><link rel="icon" href="assets/monogram.svg" type="image/svg+xml"><style>*{box-sizing:border-box}body{margin:0;background:#eef1f3;color:#222;font:14px/1.65 "Segoe UI","Microsoft YaHei",sans-serif}main{max-width:900px;margin:35px auto;background:white;padding:50px 65px}header{border-bottom:3px solid #222;padding-bottom:22px}h1{font-size:32px;letter-spacing:-1px;margin:0}h1 small{font-size:16px;color:#58616a}h2{border-bottom:1px solid #ddd;padding:8px 0;font-size:17px;margin-top:24px}h3{font-size:15px;margin:0}.stack{color:#58616a}p{margin:5px 0}.row{display:flex;justify-content:space-between;gap:15px;align-items:baseline}.row span{font-size:12px;color:#666;white-space:nowrap}ul{padding-left:18px;margin:6px 0}article{margin:15px 0;break-inside:avoid}nav{max-width:900px;margin:22px auto;display:flex;flex-wrap:wrap;gap:12px;padding:0 20px}nav a,button{font:inherit;color:#222;padding:9px 14px;background:white;border:1px solid #ccd4d9;border-radius:5px;cursor:pointer;text-decoration:none}@media(max-width:640px){main{padding:28px 20px;margin:15px 0}.row{display:block}}@page{size:A4;margin:15mm}@media print{body{background:white;font-size:10.5pt;line-height:1.5}main{padding:0;margin:0;max-width:none}nav{display:none}h1{font-size:24pt}h2{font-size:13pt}h3{font-size:11pt}}</style></head><body><nav><a href="./">返回个人主页</a><button type="button" onclick="window.print()">打印 / 保存为 PDF</button><a href="resume.pdf" download>下载简历 PDF</a></nav><main><header><h1>${escape(profile.name)} <small>${escape(profile.englishName)}</small></h1><p>${escape(profile.title)}</p><p>${escape(profile.location)} · <a href="mailto:${escape(profile.email)}">${escape(profile.email)}</a></p></header><h2>教育经历</h2>${education}<h2>技术实践</h2><p>${profile.skills.map(escape).join(" / ")}</p><h2>实习经历</h2>${work}<h2>项目经历</h2>${projects}<h2>奖项</h2><p>${profile.awards.map(escape).join("；")}</p></main></body></html>`;
fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public/resume.html"), document + "\n");
console.log("Generated public/resume.html from src/data/profile.json");
