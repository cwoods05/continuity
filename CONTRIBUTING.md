# Contributing to Continuity

Continuity is a completed proof-of-concept. The most useful contributions are
accurate bug reports and small fixes that keep the existing CLI honest — not
new product features.

## Development setup

```bash
git clone https://github.com/cwoods05/continuity
cd continuity
pnpm install
pnpm dev brief        # run without building
pnpm run build        # compile TypeScript
pnpm test             # run test suite
```

Requires Node.js 18+ and pnpm.

## Project structure

```
src/commands/     CLI command handlers — thin, no business logic
src/lib/ai/       Domain logic (init, brief, log, doctor, templates)
src/mcp/          MCP server implementation
src/utils/        Filesystem, package.json, and prompt helpers
tests/            Vitest tests — real temp dirs, no mocks
ai/               Continuity's own /ai context files
```

## Pull requests

- Keep PRs focused on a single concern
- All tests must pass: `pnpm test`
- If your PR changes architecture or behavior, update the `/ai` files and README
- Open an issue before large changes

## Project boundaries

These were intentional constraints for the experiment and should stay:

- No AI API calls, embeddings, or external model services
- No background daemons or file watchers
- No cloud sync, databases, auth, telemetry, or web UI
- Prefer flags and stdout; the only interactive path is `continuity init -i`
- New runtime dependencies need a clear justification

## Out of scope

Not planned for this repository:

- Embeddings or vector search
- Cloud sync or team sharing
- A web app or dashboard
- Editor plugins
- Authentication or accounts
