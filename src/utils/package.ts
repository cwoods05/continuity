import { createRequire } from "node:module";

interface PackageJson {
  version: string;
  name: string;
}

export function readPackageJson(): PackageJson {
  const require = createRequire(import.meta.url);
  const pkg = require("../../package.json") as PackageJson;
  return pkg;
}
