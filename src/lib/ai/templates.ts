export interface AiFileTemplate {
  filename: string;
  content: string;
}

export const AI_DIRECTORY_NAME = "ai";

export const AI_FILE_TEMPLATES: readonly AiFileTemplate[] = [
  {
    filename: "PROJECT.md",
    content: `# Project

## Overview

Brief description of what this project is and who it is for.

## Goals

- Primary goal
- Secondary goal

## Non-Goals

What this project explicitly does not aim to solve.

## Key Constraints

Technical, organizational, or timeline constraints that shape decisions.

## Stakeholders

Who owns, maintains, or depends on this project.
`,
  },
  {
    filename: "ARCHITECTURE.md",
    content: `# Architecture

## System Overview

High-level description of how the system is organized.

## Core Components

- **Component A** — Responsibility and boundaries
- **Component B** — Responsibility and boundaries

## Data Flow

How information moves through the system.

## Directory Structure

\`\`\`
src/
  ...
\`\`\`

## Integration Points

External services, APIs, and dependencies.

## Extension Points

Where new features should plug in as the project grows.
`,
  },
  {
    filename: "DECISIONS.md",
    content: `# Decisions

Record significant technical and product decisions here. Prefer short, dated entries.

## Template

### YYYY-MM-DD — Decision title

**Context:** What problem or question prompted this decision?

**Decision:** What was chosen?

**Rationale:** Why this option over alternatives?

**Consequences:** Trade-offs, follow-up work, or risks.

---

## Log

_Add decisions below as they are made._
`,
  },
  {
    filename: "TASKS.md",
    content: `# Tasks

## Active

- [ ] Task description

## Backlog

- [ ] Future task

## Done

- [x] Completed task
`,
  },
  {
    filename: "SESSION_LOG.md",
    content: `# Session Log

Chronological record of AI-assisted work sessions. Keep entries brief and actionable.

## Template

### YYYY-MM-DD — Session title

**Focus:** What was the goal of this session?

**Changes:** Summary of files or systems touched.

**Decisions:** Link to DECISIONS.md entries if any.

**Next:** What should the next session pick up?

---

## Log

_Add session entries below._
`,
  },
  {
    filename: "AGENT_RULES.md",
    content: `# Agent Rules

Guidelines for AI agents working in this repository.

## Project Conventions

- Coding style and patterns to follow
- Testing expectations
- Commit and PR conventions

## Boundaries

- What agents should not change without explicit approval
- Areas that require extra care (security, migrations, etc.)

## Workflow

1. Read PROJECT.md and ARCHITECTURE.md before making changes
2. Update TASKS.md and SESSION_LOG.md after significant work
3. Record non-obvious decisions in DECISIONS.md

## Context Priorities

Which files or docs agents should consult first when starting work.
`,
  },
] as const;

export interface SectionDef {
  key: string;
  filename: string;
  header: string;
  useSessionExtract?: boolean;
}

export const SECTIONS: readonly SectionDef[] = [
  { key: "project", filename: "PROJECT.md", header: "--- Project ---" },
  { key: "arch", filename: "ARCHITECTURE.md", header: "--- Architecture ---" },
  { key: "tasks", filename: "TASKS.md", header: "--- Active Tasks ---" },
  {
    key: "decisions",
    filename: "DECISIONS.md",
    header: "--- Recent Decisions ---",
  },
  { key: "rules", filename: "AGENT_RULES.md", header: "--- Agent Rules ---" },
  {
    key: "log",
    filename: "SESSION_LOG.md",
    header: "--- Last Session ---",
    useSessionExtract: true,
  },
];

export function isEmptyOrTemplateOnly(content: string): boolean {
  const trimmed = content.trim();
  if (trimmed.endsWith("_Add decisions below as they are made._")) return true;
  if (trimmed.endsWith("_Add session entries below._")) return true;
  const lines = trimmed.split("\n");
  const withoutH1 = lines
    .filter((line, i) => !(i === 0 && /^#\s/.test(line)))
    .join("\n")
    .trim();
  if (withoutH1.length < 30) return true;
  return false;
}
