import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const info = JSON.parse(fs.readFileSync(path.join(root, "build-info.json"), "utf8"));
const portArg = process.argv.find((a) => a.startsWith("--port="));
const portIndex = process.argv.indexOf("--port");
const port = Number(
  portArg?.split("=")[1] ||
    (portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT) ||
    3000,
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};
const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }
  const prefix = info.basePath;
  if (prefix && pathname === prefix) {
    response.writeHead(301, { Location: prefix + "/" });
    response.end();
    return;
  }
  if (prefix && !pathname.startsWith(prefix + "/")) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  let file = path.resolve(root, "." + pathname.slice(prefix.length));
  if (file !== root && !file.startsWith(root + path.sep)) {
    response.writeHead(403);
    response.end();
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(fs.readFileSync(path.join(root, "404.html")));
    return;
  }
  response.writeHead(200, {
    "Content-Type": types[path.extname(file)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(file).pipe(response);
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Preview: http://127.0.0.1:${port}${info.basePath}/`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close(() => process.exit(0)));
