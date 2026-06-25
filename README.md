# Continuity

**Project memory for AI-assisted software development.**

Continuity keeps your AI coding sessions aligned across chats, tools, and time.
It gives any AI assistant — Cursor, Claude, ChatGPT, Copilot — instant access to
your project's goals, architecture, decisions, and current tasks.

No API keys. No background services. No lock-in. Just a structured /ai directory
and a CLI that makes it useful.

---

## The Problem

AI coding assistants forget everything between sessions. Every new chat starts cold:
no knowledge of your architecture, your decisions, your conventions, or what you
were working on. You end up re-explaining the same context repeatedly, or accepting
degraded output from an agent that doesn't know your codebase.

---

## How It Works

Continuity scaffolds a small /ai directory in your project. You fill in the files
once. From then on, one command gives any AI assistant everything it needs to work
effectively in your codebase.

```
# 1. Initialize
npx continuity init

# 2. Fill in your /ai files (PROJECT.md, ARCHITECTURE.md, TASKS.md, etc.)

# 3. At the start of any AI session:
continuity brief | pbcopy   # macOS — copies context to clipboard
continuity brief | xclip    # Linux
continuity brief            # print to stdout, copy manually

# 4. Paste into your AI assistant and start working.
```

---

## Sample Output

Running `continuity brief` on a real project produces output like this:

```
=== Continuity Brief ===
Generated: 2025-06-25T14:00:00.000Z

--- Project ---
# Project

## Overview
Continuity is a CLI tool that helps developers maintain context across AI coding sessions.

## Goals
- Make AI coding assistants more effective by giving them durable project memory
- Work with any AI tool without lock-in

--- Active Tasks ---
# Tasks

## Active
- [ ] Add README demo GIF
- [ ] Write tests for brief and log logic

## Done
- [x] continuity init
- [x] continuity brief
- [x] continuity log

--- Recent Decisions ---
# Decisions

### 2025-06-25 — brief command chosen as v0.2 feature
**Decision:** Static context assembly to stdout. No AI calls, no API keys.
**Rationale:** Lowest-friction path to useful output in any AI workflow.

--- Last Session ---
### 2025-06-25 — Implemented continuity brief and continuity log
**Focus:** Implement brief command and design log command.
**Changes:** Created brief.ts, session.ts, log.ts, and command handlers.
**Next:** Add README demo GIF. Write tests.

=== End Brief ===
```

---

## Commands

### continuity init

Creates the /ai directory and scaffolds these files if they do not already exist:

```
ai/
  PROJECT.md       # What the project is and why it exists
  ARCHITECTURE.md  # How the system is structured
  TASKS.md         # Active work, backlog, and done
  DECISIONS.md     # Key technical and product decisions
  AGENT_RULES.md   # How AI agents should behave in this repo
  SESSION_LOG.md   # Chronological log of AI-assisted sessions
```

Existing files are never overwritten.

### continuity brief

Reads the /ai directory and prints a compact context summary to stdout.
Skips any file that is missing or contains only template placeholder text.

Options:
```
--no-rules          Omit AGENT_RULES.md from output
--only <sections>   Include only specific sections
                    Valid keys: project, arch, tasks, decisions, rules, log
-d, --dir <path>    Target a different project directory
```

Examples:
```
continuity brief
continuity brief | pbcopy
continuity brief --only project,tasks
continuity brief --no-rules
```

### continuity log

Appends a structured session entry to ai/SESSION_LOG.md.

Options:
```
--focus <text>       What the session focused on (required)
--changes <text>     Summary of what changed (required)
--decisions <text>   Decisions made, or "none" (required)
--next <text>        What the next session should pick up (required)
--date <YYYY-MM-DD>  Override today's date (optional)
-d, --dir <path>     Target a different project directory
```

Example:
```
continuity log \
  --focus "Implemented auth middleware" \
  --changes "Created src/middleware/auth.ts, updated routes" \
  --decisions "Used JWT over sessions for statelessness" \
  --next "Write tests for token expiry edge cases"
```

---

## Install

Not yet published to npm. To use it today:

```
git clone https://github.com/YOUR_USERNAME/continuity.git
cd continuity
pnpm install
pnpm build
npm link
```

Then run continuity from any project directory.

---

## The /ai Directory

The /ai directory is designed to be committed to your repository. It is the
source of truth for project context. Keep it updated as the project evolves.

Think of it as documentation that works for humans and AI equally well.

---

## Roadmap

| Phase | Focus |
|-------|-------|
| MVP   | init command, /ai scaffolding |
| v0.2  | brief and log commands |
| v0.3  | continuity doctor — validate /ai health |
| v0.4  | MCP server — agents pull context automatically |
| v1.0  | Stable API, plugin system, team sharing |

---

## License

MIT
