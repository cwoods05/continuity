import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { appendSessionEntry } from "../src/lib/ai/log.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true })));
});

async function createTempProject(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "continuity-log-test-"));
  tempDirs.push(dir);
  return dir;
}

async function createAiDir(projectDir: string): Promise<string> {
  const aiDir = path.join(projectDir, "ai");
  await mkdir(aiDir, { recursive: true });
  return aiDir;
}

describe("appendSessionEntry", () => {
  it("creates SESSION_LOG.md if it does not exist and appends the entry", async () => {
    const projectDir = await createTempProject();
    await createAiDir(projectDir);

    const result = await appendSessionEntry(projectDir, {
      focus: "New session",
      changes: "Created files",
      decisions: "none",
      next: "Write tests",
    });

    const filePath = path.join(projectDir, "ai", "SESSION_LOG.md");
    const content = await readFile(filePath, "utf8");

    expect(content).toContain("# Session Log");
    expect(content).toContain("## Log");
    expect(result.filePath).toBe(filePath);
    expect(result.entryAdded).toContain("**Focus:** New session");
  });

  it("appends a new entry to an existing SESSION_LOG.md without overwriting prior entries", async () => {
    const projectDir = await createTempProject();
    const aiDir = await createAiDir(projectDir);

    const existing = `# Session Log

## Log

### 2025-06-01 — Existing session

**Focus:** Keep me

**Changes:** Original content

**Decisions:** none

**Next:** Continue

---
`;

    await writeFile(path.join(aiDir, "SESSION_LOG.md"), existing, "utf8");

    await appendSessionEntry(projectDir, {
      focus: "Second session",
      changes: "Added more",
      decisions: "none",
      next: "Ship",
    });

    const content = await readFile(path.join(aiDir, "SESSION_LOG.md"), "utf8");

    expect(content).toContain("### 2025-06-01 — Existing session");
    expect(content).toContain("**Focus:** Keep me");
    expect(content).toContain("**Focus:** Second session");
    expect(content).toContain("**Changes:** Added more");
  });

  it("entry contains all four required fields: Focus, Changes, Decisions, Next", async () => {
    const projectDir = await createTempProject();
    await createAiDir(projectDir);

    const result = await appendSessionEntry(projectDir, {
      focus: "Test focus",
      changes: "Test changes",
      decisions: "Test decisions",
      next: "Test next",
    });

    expect(result.entryAdded).toContain("**Focus:** Test focus");
    expect(result.entryAdded).toContain("**Changes:** Test changes");
    expect(result.entryAdded).toContain("**Decisions:** Test decisions");
    expect(result.entryAdded).toContain("**Next:** Test next");
  });

  it("entry heading starts with ### followed by the date", async () => {
    const projectDir = await createTempProject();
    await createAiDir(projectDir);

    const result = await appendSessionEntry(projectDir, {
      focus: "Heading test",
      changes: "changes",
      decisions: "none",
      next: "next",
    });

    expect(result.entryAdded).toMatch(/^### \d{4}-\d{2}-\d{2} — Heading test/m);
  });

  it("uses date override when provided", async () => {
    const projectDir = await createTempProject();
    await createAiDir(projectDir);

    const result = await appendSessionEntry(projectDir, {
      focus: "Override session",
      changes: "changes",
      decisions: "none",
      next: "next",
      date: "2024-12-31",
    });

    expect(result.entryAdded).toContain("### 2024-12-31 — Override session");
  });

  it("returns an object indicating success", async () => {
    const projectDir = await createTempProject();
    await createAiDir(projectDir);

    const result = await appendSessionEntry(projectDir, {
      focus: "Success test",
      changes: "changes",
      decisions: "none",
      next: "next",
    });

    expect(result).toEqual({
      entryAdded: expect.stringContaining("**Focus:** Success test"),
      filePath: path.join(projectDir, "ai", "SESSION_LOG.md"),
    });
  });
});
