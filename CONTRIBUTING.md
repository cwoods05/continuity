# Contributing to Continuity

Thank you for your interest. Continuity is an early-stage project and the most
valuable contributions right now are user feedback, not pull requests.

---

## The most useful thing you can do

Try Continuity on a real project. Then open an issue and tell us:

- What was confusing or unclear
- What you expected to happen that did not happen
- Whether you would use it again and why
- What your actual AI coding workflow looks like

This feedback directly shapes what gets built next.

---

## Development setup

```
git clone https://github.com/cwoods05/continuity
cd continuity
pnpm install
pnpm dev brief        # run without building
pnpm run build        # compile TypeScript
pnpm test             # run test suite
```

Requires Node.js 18+ and pnpm.

---

## Project structure

```
src/commands/     CLI command handlers — thin, no business logic
src/lib/ai/       All domain logic
src/mcp/          MCP server implementation
src/utils/        Filesystem and package utilities
tests/            Vitest tests — real temp dirs, no mocks
ai/               Continuity's own /ai context files
```

---

## Adding a command

1. Create src/commands/yourcommand.ts exporting registerYourcommandCommand(program)
2. Create src/lib/ai/yourcommand.ts with domain logic
3. Register in src/cli.ts
4. Add tests in tests/yourcommand.test.ts

---

## Principles

- No AI API calls, embeddings, or external services
- No background daemons or file watchers
- No interactive prompts — everything is flags-based and pipeable
- All new runtime dependencies require explicit justification

---

## Pull requests

- Keep PRs focused on a single concern
- All tests must pass: pnpm test
- If your PR changes architecture, update the /ai files
- Open an issue before starting large changes

---

## What we are not building right now

- Embeddings or vector search
- Cloud sync or team sharing
- A web app or dashboard
- Editor plugins
- Authentication or accounts

If you think one of these is important, open an issue explaining the use case.
