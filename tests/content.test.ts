import { describe, expect, it } from "vitest";
import { isEmptyOrTemplateOnly } from "../src/lib/ai/content.js";

describe("isEmptyOrTemplateOnly", () => {
  it("returns true for empty string", () => {
    expect(isEmptyOrTemplateOnly("")).toBe(true);
  });

  it('returns true for string ending with "_Add decisions below as they are made._"', () => {
    const content = `# Decisions

## Log

_Add decisions below as they are made._`;

    expect(isEmptyOrTemplateOnly(content)).toBe(true);
  });

  it('returns true for string ending with "_Add session entries below._"', () => {
    const content = `# Session Log

## Log

_Add session entries below._`;

    expect(isEmptyOrTemplateOnly(content)).toBe(true);
  });

  it("returns true for a file with only an H1 heading and nothing else meaningful", () => {
    expect(isEmptyOrTemplateOnly("# Project\n")).toBe(true);
  });

  it("returns false for a file with real content", () => {
    const content = `# Project

## Overview

Continuity is a CLI tool that helps developers maintain context across AI coding sessions.`;

    expect(isEmptyOrTemplateOnly(content)).toBe(false);
  });
});
