# Agent Rules

## Project Conventions

- All source files are TypeScript with strict mode enabled
- Use ESM imports with .js extensions (e.g. import { x } from "./x.js")
- Async file I/O only — never use sync fs methods
- Commander is the only CLI framework — do not introduce alternatives
- No external runtime dependencies beyond @modelcontextprotocol/sdk and commander
- All new commands follow the pattern: src/commands/x.ts exports registerXCommand(program)
- All domain logic lives in src/lib/ai/ not in command handlers

## Boundaries

- Do not add AI API calls, embeddings, or vector databases
- Do not add background services, file watchers, or daemons
- Do not add config files or environment variable requirements
- Do not introduce new runtime dependencies without explicit approval
- Do not silently rewrite user-owned /ai content outside init scaffolding, log append, and MCP write tools

## Workflow

1. Read PROJECT.md and ARCHITECTURE.md before making changes
2. After significant work, update TASKS.md and append to SESSION_LOG.md
3. Record non-obvious decisions in DECISIONS.md

## Context Priorities

Read in this order when starting work: PROJECT.md, ARCHITECTURE.md, TASKS.md, SESSION_LOG.md (last entry only)
