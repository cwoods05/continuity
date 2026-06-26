import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  initializeAiDirectory,
  writeInteractiveProjectFile,
} from "../src/lib/ai/init.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true })));
});

async function createTempProject(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "continuity-init-test-"));
  tempDirs.push(dir);
  return dir;
}

describe("writeInteractiveProjectFile", () => {
  it("overwrites PROJECT.md with answers after scaffolding", async () => {
    const projectDir = await createTempProject();
    await initializeAiDirectory(projectDir);

    await writeInteractiveProjectFile(projectDir, {
      projectName: "Helios",
      description: "REST API for solar monitoring",
      stack: "Node.js + Fastify",
    });

    const content = await readFile(
      path.join(projectDir, "ai", "PROJECT.md"),
      "utf8",
    );

    expect(content).toContain("Helios — REST API for solar monitoring");
    expect(content).toContain("Node.js + Fastify");
    expect(content).toContain("_Add your project goals here._");
  });
});
