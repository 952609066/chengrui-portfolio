import fs from "node:fs";
import path from "node:path";

/** Emit static files at the dotted segment URLs requested by the App Router.
 * Some Windows exports split the __next.* segment name into directories.
 * Already-flat Linux exports are left unchanged.
 */
export function createSegmentAliases(directory) {
  const root = path.resolve(directory);
  const files = [];
  const collect = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) collect(file);
      else if (entry.isFile()) files.push(file);
    }
  };
  collect(root);
  let count = 0;
  for (const file of files) {
    const parts = path.relative(root, file).split(path.sep);
    const marker = parts.findIndex((part) => part.startsWith("__next."));
    if (marker < 0 || marker === parts.length - 1 || !file.endsWith(".txt")) continue;
    const destination = path.join(root, ...parts.slice(0, marker), parts.slice(marker).join("."));
    fs.copyFileSync(file, destination);
    count++;
  }
  return count;
}
