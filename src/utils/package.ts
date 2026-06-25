import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

interface PackageJson {
  version: string;
}

export function readPackageJson(): PackageJson {
  const packagePath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "package.json",
  );

  const raw = readFileSync(packagePath, "utf8");
  return JSON.parse(raw) as PackageJson;
}
