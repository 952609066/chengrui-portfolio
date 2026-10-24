import { withContentCollections } from "@content-collections/next";
import { basePath } from "./src/lib/site.mjs";
export default withContentCollections({
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
});
