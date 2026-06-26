# Continuity

**Project memory for AI-assisted software development.**

Continuity gives any AI coding assistant instant access to your project's goals,
architecture, decisions, and active tasks. One command. No API keys. No background
services. Works with every AI tool.

---

## The Problem

AI coding assistants forget everything between sessions. Every new chat starts cold.
You re-explain the same architecture, the same conventions, the same decisions — or
you accept degraded output from an agent that does not know your codebase.

---

## How It Works

Continuity scaffolds a small /ai directory in your project. You fill in the files once.
From then on, one command gives any AI assistant everything it needs to work effectively.

  # 1. Install
  npm install -g @continuityai/cli

  # 2. Initialize your project
  continuity init

  # 3. Fill in your /ai files (PROJECT.md, ARCHITECTURE.md, TASKS.md, etc.)

  # 4a. Manual workflow — copy brief to clipboard and paste into any AI chat:
  continuity brief | pbcopy     # macOS
  continuity brief | xclip      # Linux
  continuity brief              # print to stdout

  # 4b. Automatic workflow — run as an MCP server for Claude Desktop or Cursor:
  continuity mcp

  # 5. After your session, log what happened:
  continuity log \
    --focus "Implemented auth middleware" \
    --changes "Created src/middleware/auth.ts, updated routes" \
    --decisions "Used JWT over sessions for statelessness" \
    --next "Write tests for token expiry edge cases"

  # 6. Check your context files are healthy:
  continuity doctor

---

## MCP Setup (Automatic Context Injection)

With MCP, agents pull your project context automatically. No copy-paste required.

### Claude Desktop

Add to your Claude Desktop config (~/.claude/claude_desktop_config.json):

  {
    "mcpServers": {
      "continuity": {
        "command": "continuity",
        "args": ["mcp", "--dir", "/path/to/your/project"]
      }
    }
  }

### Cursor

Add to your Cursor MCP settings:

  {
    "continuity": {
      "command": "continuity",
      "args": ["mcp", "--dir", "/path/to/your/project"]
    }
  }

Once connected, your agent can call:
- get_brief — returns the full project context brief
- get_file — returns any specific /ai file by name
- log_session — append a session entry to SESSION_LOG.md
- update_file — overwrite a specific /ai file

---

## Commands

### continuity init

Creates the /ai directory and scaffolds these files if they do not already exist:

  ai/
    PROJECT.md       # What the project is and why it exists
    ARCHITECTURE.md  # How the system is structured
    TASKS.md         # Active work, backlog, and done
    DECISIONS.md     # Key technical and product decisions
    AGENT_RULES.md   # How AI agents should behave in this repo
    SESSION_LOG.md   # Chronological log of AI-assisted sessions

Existing files are never overwritten.

Use `--interactive` (`-i`) to prompt for project name, description, and stack, then
pre-fill PROJECT.md automatically.

```
$ continuity init

✔ Created ai/PROJECT.md
✔ Created ai/ARCHITECTURE.md
✔ Created ai/TASKS.md
✔ Created ai/DECISIONS.md
✔ Created ai/AGENT_RULES.md
✔ Created ai/SESSION_LOG.md

Project memory initialized. Fill in your /ai files, then run:
  continuity brief
```

### continuity brief

Reads the /ai directory and prints a compact context summary to stdout.

  --no-rules            Omit AGENT_RULES.md from output
  --only <sections>     Include only specific sections
                        Keys: project, arch, tasks, decisions, rules, log
  --format <format>     Output format: text or json (default: text)
  -d, --dir <path>      Target a different project directory

```
$ continuity brief

=== Continuity Brief ===
Generated: 2025-06-25T14:32:01.000Z

--- Project ---
# Project

Helios is a REST API for real-time solar energy monitoring. It ingests readings
from inverter hardware, aggregates by site and time window, and exposes a JSON API
consumed by a React dashboard.

Goals: sub-200ms p99 latency, multi-tenant by design, deployable on a single VPS.

--- Architecture ---
# Architecture

Node.js + Fastify. PostgreSQL with time-series partitioning. Redis for caching
aggregated readings. Deployed via Docker Compose on a single DigitalOcean Droplet.

--- Active Tasks ---
# Tasks

## Active
- [ ] Implement /readings/aggregate endpoint
- [ ] Add Redis cache layer for site-level rollups
- [ ] Write load tests for ingestion pipeline

--- Recent Decisions ---
# Decisions

### 2025-06-24 — Chose Fastify over Express
Fastify's schema-based validation and 2x throughput advantage justify the
migration cost. Express stays in the codebase until all routes are ported.

--- Last Session ---
### 2025-06-25 — Ingestion pipeline refactor

Focus: Refactored the inverter ingestion queue to use worker threads.
Changes: Created src/workers/ingestion.ts, updated src/queue/index.ts.
Next: Add Redis cache layer and benchmark throughput improvement.

=== End Brief ===
```

### continuity mcp

Starts an MCP server over stdio. Connect from Claude Desktop, Cursor, or any
MCP-compatible agent. Exposes get_brief, get_file, log_session, and update_file tools.

  -d, --dir <path>      Target project directory

```
# Agent calls get_brief tool — receives full project context automatically.
# No copy-paste required. Context updates every time the agent calls the tool.
```

### continuity log

Appends a structured session entry to ai/SESSION_LOG.md.

  --focus <text>        What the session focused on (required)
  --changes <text>      Summary of what changed (required)
  --decisions <text>    Decisions made, or "none" (required)
  --next <text>         What the next session should pick up (required)
  --date <YYYY-MM-DD>   Override today's date (optional)
  -d, --dir <path>      Target a different project directory

```
$ continuity log \
  --focus "Implemented Redis cache layer" \
  --changes "Created src/cache/redis.ts, updated aggregate endpoint" \
  --decisions "TTL set to 60s based on inverter polling interval" \
  --next "Write load tests for ingestion pipeline"

✔ Session logged to ai/SESSION_LOG.md
```

### continuity doctor

Checks the health of your /ai context files.

  -d, --dir <path>      Target a different project directory

Exit code 0 if all files are healthy. Exit code 1 if any are missing or empty.

```
$ continuity doctor

✔ PROJECT.md      healthy
✔ ARCHITECTURE.md healthy
✔ TASKS.md        healthy
✔ DECISIONS.md    healthy
✔ AGENT_RULES.md  healthy
✔ SESSION_LOG.md  healthy

All context files are healthy.
```

```
$ continuity doctor

✔ PROJECT.md      healthy
✗ ARCHITECTURE.md missing
✔ TASKS.md        healthy
✗ DECISIONS.md    empty
✔ AGENT_RULES.md  healthy
✔ SESSION_LOG.md  healthy

2 files need attention. Run continuity init to recreate missing files.
```

---

## Install

  npm install -g @continuityai/cli

The package is published as @continuityai/cli but installs as the `continuity` command.
All commands below use `continuity` as the binary name.

Or use without installing:

  npx @continuityai/cli init
  npx @continuityai/cli brief

---

## The /ai Directory

The /ai directory is designed to be committed to your repository. It is the
source of truth for project context that works equally well for humans and AI.

---

## Roadmap

  Phase     Feature
  -------   -------------------------------------------------------
  v0.3      init, brief, log, doctor — complete habit loop
  v0.4      MCP server — agents pull context automatically (current)
  v1.0      Stable API, team sharing, editor plugins

---

## License

MIT
