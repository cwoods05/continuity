# Continuity

**Repo-level memory for AI coding assistants.**

AI agents forget everything between sessions. You re-explain the same architecture,
re-describe the same conventions, re-paste the same context — every single time.

Continuity fixes this. One command gives any AI assistant everything it needs to
work effectively in your project.

---

## Try it in 60 seconds

```
npm install -g @continuityai/cli

cd your-project
continuity init
continuity brief | pbcopy   # macOS — paste into any AI chat and start working
```

That is it. No API keys. No background services. Works with Cursor, Claude,
ChatGPT, Copilot, or any other AI tool.

---

## The problem

Every AI coding session starts cold. Your agent does not know:

- What this project does or why it exists
- How the codebase is structured
- What decisions were made and why
- What is currently in progress
- How it should behave in this specific repo

You either paste context manually every time, accept worse output, or spend the
first ten minutes of every session re-explaining things you explained last week.

---

## How Continuity works

Continuity scaffolds a small /ai directory in your project. You fill in the
files once. From then on, one command produces a compact context brief that any
AI assistant can immediately use.

```
continuity init        # scaffold /ai directory with context files
continuity brief       # generate context brief and paste into any AI chat
continuity log         # record what happened after your session
continuity doctor      # check if your context files are healthy
```

The /ai directory lives in your repo. It is version-controlled. It is readable
by humans and agents alike. It belongs to the project, not to any chat window.

---

## What the brief looks like

```
$ continuity brief

=== Continuity Brief ===
Generated: 2025-06-26T09:14:00.000Z

--- Project ---
Helios is a REST API for real-time solar energy monitoring. It ingests readings
from inverter hardware and exposes a JSON API consumed by a React dashboard.
Goals: sub-200ms p99 latency, multi-tenant by design, deployable on a single VPS.

--- Architecture ---
Node.js + Fastify. PostgreSQL with time-series partitioning. Redis for caching.
Deployed via Docker Compose on DigitalOcean.

--- Active Tasks ---
- [ ] Implement /readings/aggregate endpoint
- [ ] Add Redis cache layer for site-level rollups
- [ ] Write load tests for ingestion pipeline

--- Recent Decisions ---
### 2025-06-24 — Chose Fastify over Express
2x throughput advantage and schema validation justify the migration cost.

--- Last Session ---
### 2025-06-25 — Ingestion pipeline refactor
Focus: Refactored inverter ingestion queue to use worker threads.
Next: Add Redis cache layer and benchmark throughput.

=== End Brief ===
```

Paste this at the start of any chat. Your agent is immediately oriented.

---

## The /ai directory

```
ai/
  PROJECT.md       # What this project is and why it exists
  ARCHITECTURE.md  # How the system is structured
  TASKS.md         # Active work, backlog, done
  DECISIONS.md     # Key technical and product decisions
  AGENT_RULES.md   # How agents should behave in this repo
  SESSION_LOG.md   # Chronological log of AI-assisted sessions
```

These files are designed to be committed to your repository. They are the source
of truth for project context — useful to humans reading the repo and to any AI
agent working in it.

---

## After your session

```
continuity log \
  --focus "Implemented Redis cache layer" \
  --changes "Created src/cache/redis.ts, updated aggregate endpoint" \
  --decisions "TTL set to 60s based on inverter polling interval" \
  --next "Write load tests for ingestion pipeline"
```

This appends a structured entry to SESSION_LOG.md, so the next session — whether
tomorrow or next month — picks up exactly where you left off.

---

## Automatic context with MCP

If you use Claude Desktop or Cursor with MCP support, you can skip the copy-paste
step entirely. Continuity runs as a local MCP server and your agent pulls context
automatically.

### Claude Desktop

Add to ~/.claude/claude_desktop_config.json:

```json
{
  "mcpServers": {
    "continuity": {
      "command": "continuity",
      "args": ["mcp", "--dir", "/path/to/your/project"]
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "continuity": {
    "command": "continuity",
    "args": ["mcp", "--dir", "/path/to/your/project"]
  }
}
```

Once connected, your agent calls get_brief automatically. No copy-paste required.

---

## Why not just use a README, Cursor rules, or CLAUDE.md?

README is written for humans discovering the project. It is not structured for
agents, does not track decisions or sessions, and grows unwieldy as a context source.

Cursor rules / .cursorrules are editor-specific and scoped to code style. They
do not carry project goals, architecture decisions, task state, or session history.

CLAUDE.md is Claude-specific. It does not work across tools, is not version-
controlled as structured context, and has no session logging or health checking.

Continuity is model-agnostic, tool-agnostic, and structured. It belongs to the
repo, not to any specific editor or assistant. The goal is for /ai to become a
convention — like .github or .vscode — that any AI tool can read.

---

## Who is this for?

Continuity is useful if you:

- Use AI coding assistants regularly (Cursor, Claude, Copilot, ChatGPT)
- Work on projects that span multiple sessions, days, or weeks
- Find yourself re-explaining the same context at the start of every chat
- Want your agents to stay aligned with your architecture and decisions over time
- Work solo and use AI as a collaborator, not just an autocomplete

It is probably not useful if you only use AI for one-off questions or short scripts
where context does not accumulate.

---

## Current status

Continuity is an early-stage open-source project. The core workflow works and is
published on npm. The project is actively seeking early users and feedback.

If you try it, please open an issue or start a discussion and tell us:

- What confused you
- What you wish it did differently
- Whether you would use it again

That feedback directly shapes what gets built next.

Star the repo if you find it useful or want to follow the project. It helps
more than you might think.

---

## Install

```
npm install -g @continuityai/cli
```

Or use without installing:

```
npx @continuityai/cli init
npx @continuityai/cli brief
```

Requires Node.js 18 or higher.

---

## Commands

### continuity init

Scaffolds the /ai directory and all context files. Existing files are never overwritten.

Use --interactive (-i) to be prompted for project name, description, and stack.
PROJECT.md is pre-filled automatically.

```
$ continuity init -i

? Project name: Helios
? What does this project do? REST API for real-time solar energy monitoring
? Primary language / stack: Node.js, Fastify, PostgreSQL

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

Reads /ai and prints a compact context summary to stdout.

```
--no-rules            Omit AGENT_RULES.md
--only <sections>     project, arch, tasks, decisions, rules, log
--format json         Machine-readable output
-d, --dir <path>      Target directory
```

### continuity log

Appends a structured session entry to SESSION_LOG.md.

```
--focus <text>        What the session focused on (required)
--changes <text>      What changed (required)
--decisions <text>    Decisions made, or "none" (required)
--next <text>         What to pick up next (required)
--date YYYY-MM-DD     Override date
-d, --dir <path>      Target directory
```

### continuity doctor

Checks whether /ai files are filled in and healthy. Exits 1 if any file needs attention.
Useful as a CI check.

```
$ continuity doctor

✔ PROJECT.md      healthy
✗ ARCHITECTURE.md missing
✔ TASKS.md        healthy
✗ DECISIONS.md    empty
✔ AGENT_RULES.md  healthy
✔ SESSION_LOG.md  healthy

2 files need attention.
```

### continuity mcp

Starts a local MCP server over stdio. Exposes get_brief, get_file, log_session,
and update_file tools to any connected agent.

```
-d, --dir <path>      Target directory
```

---

## Philosophy

Project memory belongs to the repository, not the chat window.

Context that lives only in a conversation is lost the moment the session ends.
Context that lives in the repo is permanent, version-controlled, and available
to every tool, every collaborator, and every future agent that works on the project.

Continuity is not trying to replace AI assistants or make them smarter. It is
trying to give them a stable, structured place to read and write project context —
the same way .github gives GitHub a place to find workflows and templates.

The long-term goal is for the /ai directory to become a convention: something
developers add to every new project the same way they add a README or a .gitignore.

---

## Contributing

See CONTRIBUTING.md for setup instructions and contribution guidelines.

The most useful contributions right now are not code. They are:

- Trying Continuity on a real project and reporting what confused you
- Suggesting what context you actually need your AI agent to have
- Sharing whether the habit loop (init, brief, log) feels natural or forced

Open an issue or start a GitHub Discussion. All feedback is read.

---

## License

MIT
