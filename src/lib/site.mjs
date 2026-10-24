/** Normalize a deployment prefix; GitHub repository names may contain dots, hyphens and underscores. */
export function normalizeBasePath(value = "") {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  if (
    !/^\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*$/.test(trimmed) ||
    trimmed.split("/").some((p) => p === "." || p === "..")
  ) {
    throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a path such as /my-portfolio");
  }
  return trimmed;
}
export function joinBasePath(path, prefix = "") {
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(path)) return path;
  return normalizeBasePath(prefix) + (path.startsWith("/") ? path : "/" + path);
}
export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || "");
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
export const withBasePath = (path) => joinBasePath(path, basePath);
export const absoluteUrl = (path = "/") =>
  siteUrl ? siteUrl + (path.startsWith("/") ? path : "/" + path) : undefined;
