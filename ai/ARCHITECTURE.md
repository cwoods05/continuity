# Architecture

## System Overview

Continuity is a Node.js CLI built with TypeScript and Commander. It reads and writes
markdown files in a local /ai directory. There are no external services, no databases,
and no background processes. The MCP server mode exposes project context to AI agents
over stdio using the Model Context Protocol.

## Core Components

- **CLI (src/cli.ts)** — Commander program entry point, registers all commands
- **commands/** — Thin command handlers; parse flags, call lib functions, print output
- **lib/ai/** — All domain logic: initialization, brief generation, session parsing, doctor checks, log appending
- **mcp/server.ts** — MCP server exposing get_brief and get_file tools over stdio
- **utils/** — Filesystem helpers and package.json reader

## Data Flow

1. Developer runs a continuity command
2. Command handler resolves the /ai directory from --dir or process.cwd()
3. Lib functions read markdown files from disk
4. Output is assembled as plain text and printed to stdout
5. In MCP mode, the same lib functions are called in response to tool requests from the agent

## Directory Structure

src/
  index.ts            entry point
  cli.ts              commander setup and command registration
  commands/
    init.ts           continuity init
    brief.ts          continuity brief
    log.ts            continuity log
    doctor.ts         continuity doctor
    mcp.ts            continuity mcp
  lib/
    ai/
      init.ts         /ai directory scaffolding logic
      templates.ts    file templates and section definitions
      brief.ts        brief assembly logic
      session.ts      session log parsing
      log.ts          session log appending
      doctor.ts       /ai file health checks
      content.ts      shared template-detection utilities
  mcp/
    server.ts         MCP server implementation
  utils/
    filesystem.ts     ensureDirectory, writeFileIfMissing
    package.ts        readPackageJson

## Integration Points

- @modelcontextprotocol/sdk — MCP server transport and protocol
- commander — CLI argument parsing
- Node.js fs/promises — all file I/O

## Extension Points

- New commands: add to src/commands/, register in src/cli.ts
- New MCP tools: add handlers in src/mcp/server.ts
- New /ai file sections: add to SECTIONS and AI_FILE_TEMPLATES in src/lib/ai/templates.ts
