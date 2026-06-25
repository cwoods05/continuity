# Continuity

**Maintain project continuity across AI coding sessions.**

Continuity is an open-source TypeScript CLI that helps teams and individuals preserve context when working with AI coding agents. It scaffolds a structured `/ai` directory in any project so that goals, architecture, decisions, tasks, and session history stay organized and discoverable.

## The Problem

AI coding sessions are ephemeral. Context lives in chat windows, disappears between sessions, and is hard for the next agent (or human) to reconstruct. Teams lose:

- **Intent** — why a change was made
- **State** — what was in progress and what remains
- **Decisions** — trade-offs that shaped the codebase
- **Continuity** — a reliable handoff from one session to the next

Without a shared, version-controlled context layer, every new session starts from scratch.

## The Vision

Continuity becomes the standard way to give AI agents durable project memory. A small CLI and a predictable `/ai` folder structure make context:

- **Explicit** — written down, not inferred
- **Portable** — lives in the repo alongside the code
- **Composable** — works with any editor, agent, or workflow
- **Incremental** — easy to adopt one file at a time

Long term, Continuity will help agents read, update, and reason over project context automatically — but the foundation is a simple, human-friendly documentation system that works today.

## Roadmap

| Phase | Focus |
|-------|--------|
| **MVP** | CLI foundation, `init` command, `/ai` scaffolding |
| **v0.2** | Context validation, status checks, and doctor command |
| **v0.3** | Session logging helpers and task sync utilities |
| **v0.4** | Agent integration hooks (MCP, skills, rules export) |
| **v1.0** | Stable API, plugin system, and ecosystem docs |

## Initial MVP

The first release delivers a production-quality CLI skeleton:

- `continuity init` — creates `/ai` and scaffolds missing markdown files
- Modular TypeScript architecture (commands, lib, utils)
- Commander.js CLI with room to grow
- No AI features yet — only the foundation

### Quick Start

```bash
# Install dependencies
pnpm install

# Run in development
pnpm dev init

# Build for production
pnpm build
pnpm start -- init
```

### Project Structure

```
continuity/
├── ai/                  # Continuity context for this repo
├── src/
│   ├── index.ts         # CLI entry point
│   ├── cli.ts           # Commander program setup
│   ├── commands/        # Command handlers
│   ├── lib/             # Domain logic
│   └── utils/           # Shared utilities
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT
