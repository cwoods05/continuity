import { describe, expect, it } from "vitest";
import { extractLastSessionEntry } from "../src/lib/ai/session.js";

describe("extractLastSessionEntry", () => {
  it("returns null for empty string", () => {
    expect(extractLastSessionEntry("")).toBeNull();
  });

  it("returns null when content contains only the template placeholder", () => {
    const content = `# Session Log

## Log

### YYYY-MM-DD — Session title

_Add session entries below._`;

    expect(extractLastSessionEntry(content)).toBeNull();
  });

  it("returns null when there are no lines starting with ### ", () => {
    const content = `# Session Log

## Log

_Add session entries below._`;

    expect(extractLastSessionEntry(content)).toBeNull();
  });

  it("returns the correct last entry when one entry exists", () => {
    const content = `# Session Log

## Log

### 2025-06-25 — Single session

**Focus:** Build the feature

**Changes:** Updated files

**Decisions:** none

**Next:** Ship it

---`;

    const result = extractLastSessionEntry(content);
    expect(result).toContain("### 2025-06-25 — Single session");
    expect(result).toContain("**Focus:** Build the feature");
    expect(result).toContain("**Changes:** Updated files");
    expect(result).toContain("**Decisions:** none");
    expect(result).toContain("**Next:** Ship it");
    expect(result).toBe(
      `### 2025-06-25 — Single session

**Focus:** Build the feature

**Changes:** Updated files

**Decisions:** none

**Next:** Ship it

---`,
    );
  });

  it("returns only the LAST entry when multiple entries exist", () => {
    const content = `# Session Log

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

---`;

    const result = extractLastSessionEntry(content);
    expect(result).toContain("### 2025-06-25 — Second session");
    expect(result).toContain("**Focus:** Second focus");
    expect(result).not.toContain("### 2025-06-01 — First session");
    expect(result).not.toContain("**Focus:** First focus");
  });

  it("returns a trimmed string", () => {
    const content = `

### 2025-06-25 — Trimmed session

**Focus:** focus

**Changes:** changes

**Decisions:** none

**Next:** next

---


`;

    const result = extractLastSessionEntry(content);
    expect(result).toBe(
      `### 2025-06-25 — Trimmed session

**Focus:** focus

**Changes:** changes

**Decisions:** none

**Next:** next

---`,
    );
  });
});
