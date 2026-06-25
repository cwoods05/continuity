import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(directoryPath: string): Promise<boolean> {
  const exists = await pathExists(directoryPath);

  if (!exists) {
    await mkdir(directoryPath, { recursive: true });
    return true;
  }

  return false;
}

export async function writeFileIfMissing(
  filePath: string,
  content: string,
): Promise<boolean> {
  const exists = await pathExists(filePath);

  if (exists) {
    return false;
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
  return true;
}
