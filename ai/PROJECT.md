# Project

## Overview

Continuity is a Node.js CLI that explores repository-owned context for AI coding
assistants. It scaffolds an `/ai` directory of markdown files, assembles them
into a plain-text brief (`continuity brief`), appends session notes
(`continuity log`), checks file health (`continuity doctor`), and can expose the
same data over a local stdio MCP server (`continuity mcp`).

It does not call AI APIs or run services outside the developer's machine.

## Goals

- Make project context version-controlled and tool-agnostic
- Keep the workflow local, flag-driven, and pipeable
- Demonstrate an `/ai` convention as a portable experiment, not as platform infrastructure

## Non-Goals

- Continuity is not an AI assistant itself
- Continuity does not call any AI APIs
- Continuity is not a documentation generator
- Continuity does not replace human-written documentation
- Continuity is not an actively evolving SaaS product

## Key Constraints

- Must work without API keys or background services
- Output must be model-agnostic plain text
- CLI must be installable globally via npm
- Scope stays on-disk files + local MCP stdio

## Stakeholders

Developers evaluating or adopting simple, file-based context for AI-assisted work.
