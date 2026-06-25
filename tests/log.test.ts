import { mkdtemp, readFile, rm } from "node:fs/promises";
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

describe("appendSessionEntry", () => {
  it("throws if /ai directory does not exist", async () => {
    const projectDir = await createTempProject();

    await expect(
      appendSessionEntry(projectDir, {
        focus: "focus",
        changes: "changes",
        decisions: "none",
        next: "next",
      }),
    ).rejects.toThrow(/No \/ai directory found/);
  });

  it("creates SESSION_LOG.md if it does not exist, then appends the entry", async () => {
    const projectDir = await createTempProject();
    const { mkdir } = await import("node:fs/promises");
    await mkdir(path.join(projectDir, "ai"), { recursive: true });

    const result = await appendSessionEntry(projectDir, {
      focus: "New session",
      changes: "Created files",
      decisions: "none",
      next: "Write tests",
    });

    const filePath = path.join(projectDir, "ai", "SESSION_LOG.md");
    const content = await readFile(filePath, "utf8");

    expect(result.filePath).toBe(filePath);
    expect(content).toContain("# Session Log");
    expect(content).toContain("## Log");
    expect(content).toContain("**Focus:** New session");
    expect(content).toContain("**Changes:** Created files");
    expect(content).toContain("**Decisions:** none");
    expect(content).toContain("**Next:** Write tests");
  });

  it("appends to an existing SESSION_LOG.md without overwriting it", async () => {
    const projectDir = await createTempProject();
    const aiDir = path.join(projectDir, "ai");
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(aiDir, { recursive: true });

    const existing = `# Session Log

## Log

### 2025-06-01 — Existing session

**Focus:** Keep me

**Changes:** Original content

**Decisions:** none

**Next:** Continue

---
`;

    const filePath = path.join(aiDir, "SESSION_LOG.md");
    await writeFile(filePath, existing, "utf8");

    await appendSessionEntry(projectDir, {
      focus: "Second session",
      changes: "Added more",
      decisions: "none",
      next: "Ship",
    });

    const content = await readFile(filePath, "utf8");

    expect(content).toContain("### 2025-06-01 — Existing session");
    expect(content).toContain("**Focus:** Keep me");
    expect(content).toContain("**Focus:** Second session");
    expect(content).toContain("**Changes:** Added more");
  });

  it("uses today's date by default in YYYY-MM-DD format", async () => {
    const projectDir = await createTempProject();
    const { mkdir } = await import("node:fs/promises");
    await mkdir(path.join(projectDir, "ai"), { recursive: true });

    const now = new Date();
    const expectedDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");

    const result = await appendSessionEntry(projectDir, {
      focus: "Dated session",
      changes: "changes",
      decisions: "none",
      next: "next",
    });

    expect(result.entryAdded).toContain(`### ${expectedDate} — Dated session`);
  });

  it("respects the date override", async () => {
    const projectDir = await createTempProject();
    const { mkdir } = await import("node:fs/promises");
    await mkdir(path.join(projectDir, "ai"), { recursive: true });

    const result = await appendSessionEntry(projectDir, {
      focus: "Override session",
      changes: "changes",
      decisions: "none",
      next: "next",
      date: "2024-12-31",
    });

    expect(result.entryAdded).toContain("### 2024-12-31 — Override session");
    expect(result.entryAdded).toContain("**Focus:** Override session");
    expect(result.entryAdded).toContain("**Changes:** changes");
    expect(result.entryAdded).toContain("**Decisions:** none");
    expect(result.entryAdded).toContain("**Next:** next");
  });
});
