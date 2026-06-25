import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateBrief } from "../src/lib/ai/brief.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true })));
});

async function createTempProject(): Promise<string> {
  const dir = await mkdtemp(path.join(tmpdir(), "continuity-brief-test-"));
  tempDirs.push(dir);
  return dir;
}

async function createAiDir(projectDir: string): Promise<string> {
  const aiDir = path.join(projectDir, "ai");
  await mkdir(aiDir, { recursive: true });
  return aiDir;
}

const REAL_PROJECT_CONTENT = `# Project

## Overview

Continuity is a CLI tool that helps developers maintain context across AI coding sessions.
It scaffolds a local /ai directory and assembles project context for AI assistants.
`;

const REAL_TASKS_CONTENT = `# Tasks

## Active

- [ ] Publish to npm

## Done

- [x] continuity init
- [x] continuity brief
`;

const REAL_RULES_CONTENT = `# Agent Rules

## Project Conventions

- Use TypeScript with strict mode enabled
- Use ESM imports with .js extensions
- All domain logic lives in src/lib/ai/
`;

describe("generateBrief", () => {
  it("returns only header and footer when /ai directory is empty", async () => {
    const projectDir = await createTempProject();
    await createAiDir(projectDir);

    const result = await generateBrief(projectDir, { includeRules: true });

    expect(result.content).toContain("=== Continuity Brief ===");
    expect(result.content).toContain("=== End Brief ===");
    expect(result.sectionsIncluded).toEqual([]);
  });

  it("includes a section when the corresponding file exists and has real content", async () => {
    const projectDir = await createTempProject();
    const aiDir = await createAiDir(projectDir);
    await writeFile(path.join(aiDir, "PROJECT.md"), REAL_PROJECT_CONTENT, "utf8");

    const result = await generateBrief(projectDir, { includeRules: true });

    expect(result.content).toContain("--- Project ---");
    expect(result.sectionsIncluded).toContain("project");
  });

  it("skips a section when the file contains only template placeholder text", async () => {
    const projectDir = await createTempProject();
    const aiDir = await createAiDir(projectDir);
    await writeFile(
      path.join(aiDir, "DECISIONS.md"),
      `# Decisions

## Log

_Add decisions below as they are made._`,
      "utf8",
    );

    const result = await generateBrief(projectDir, { includeRules: true });

    expect(result.sectionsIncluded).not.toContain("decisions");
  });

  it("respects options.includeRules === false", async () => {
    const projectDir = await createTempProject();
    const aiDir = await createAiDir(projectDir);
    await writeFile(path.join(aiDir, "AGENT_RULES.md"), REAL_RULES_CONTENT, "utf8");

    const result = await generateBrief(projectDir, { includeRules: false });

    expect(result.content).not.toContain("--- Agent Rules ---");
    expect(result.sectionsIncluded).not.toContain("rules");
  });

  it("respects options.only filtering", async () => {
    const projectDir = await createTempProject();
    const aiDir = await createAiDir(projectDir);
    await writeFile(path.join(aiDir, "PROJECT.md"), REAL_PROJECT_CONTENT, "utf8");
    await writeFile(path.join(aiDir, "TASKS.md"), REAL_TASKS_CONTENT, "utf8");

    const result = await generateBrief(projectDir, {
      includeRules: true,
      only: ["project"],
    });

    expect(result.content).toContain("--- Project ---");
    expect(result.content).not.toContain("--- Active Tasks ---");
  });

  it("sections appear in canonical order regardless of file creation order", async () => {
    const projectDir = await createTempProject();
    const aiDir = await createAiDir(projectDir);
    await writeFile(path.join(aiDir, "TASKS.md"), REAL_TASKS_CONTENT, "utf8");
    await writeFile(path.join(aiDir, "PROJECT.md"), REAL_PROJECT_CONTENT, "utf8");

    const result = await generateBrief(projectDir, { includeRules: true });

    const projectIndex = result.content.indexOf("--- Project ---");
    const tasksIndex = result.content.indexOf("--- Active Tasks ---");

    expect(projectIndex).toBeGreaterThan(-1);
    expect(tasksIndex).toBeGreaterThan(-1);
    expect(projectIndex).toBeLessThan(tasksIndex);
  });

  it("SESSION_LOG.md only includes the last entry, not the full file", async () => {
    const projectDir = await createTempProject();
    const aiDir = await createAiDir(projectDir);
    await writeFile(
      path.join(aiDir, "SESSION_LOG.md"),
      `# Session Log

## Log

### 2025-06-01 — First session

**Focus:** First focus

**Changes:** First changes

**Decisions:** none

**Next:** Continue

---

### 2025-06-25 — Second session

**Focus:** Second focus

**Changes:** Second changes

**Decisions:** none

**Next:** Finish

---`,
      "utf8",
    );

    const result = await generateBrief(projectDir, { includeRules: true });

    expect(result.content).toContain("### 2025-06-25 — Second session");
    expect(result.content).not.toContain("### 2025-06-01 — First session");
  });
});
