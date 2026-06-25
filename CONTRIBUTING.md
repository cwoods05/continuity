# Contributing to Continuity

## Setup

  git clone https://github.com/your-org/continuity
  cd continuity
  pnpm install

## Development

  pnpm dev <command>        run CLI without building
  pnpm run build            compile TypeScript to dist/
  pnpm test                 run all tests
  pnpm test --watch         run tests in watch mode

## Project Structure

  src/commands/     CLI command handlers (thin, no logic)
  src/lib/ai/       all domain logic
  src/mcp/          MCP server
  src/utils/        filesystem and package utilities
  tests/            vitest tests (real temp dirs, no mocks)
  ai/               Continuity's own /ai context files

## Adding a Command

1. Create src/commands/yourcommand.ts exporting registerYourcommandCommand(program)
2. Create src/lib/ai/yourcommand.ts with domain logic
3. Register in src/cli.ts
4. Add tests in tests/yourcommand.test.ts

## Principles

- No AI API calls, embeddings, or external services
- No background daemons or file watchers
- No interactive prompts — everything is flags-based and pipeable
- All new runtime dependencies require explicit discussion

## Running the MCP Server Locally

  pnpm dev mcp --dir /path/to/test-project

## Pull Requests

- Keep PRs focused on a single concern
- All tests must pass
- Update /ai files if architecture changes
