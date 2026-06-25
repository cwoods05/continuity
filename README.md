# Continuity

**Project memory for AI-assisted software development.**

Continuity gives any AI coding assistant — Cursor, Claude, ChatGPT, Copilot — instant
access to your project's goals, architecture, decisions, and active tasks. One command.
No API keys. No background services. Works with every AI tool.

---

## The Problem

AI coding assistants forget everything between sessions. Every new chat starts cold.
You re-explain the same architecture, the same conventions, the same decisions — or
you accept degraded output from an agent that doesn't know your codebase.

---

## How It Works

Continuity scaffolds a small /ai directory in your project. You fill in the files once.
From then on, one command gives any AI assistant everything it needs to work effectively.

  # 1. Install
  npm install -g continuity

  # 2. Initialize your project
  continuity init

  # 3. Fill in your /ai files (PROJECT.md, ARCHITECTURE.md, TASKS.md, etc.)

  # 4. At the start of any AI session:
  continuity brief | pbcopy     # macOS — copies full context to clipboard
  continuity brief | xclip      # Linux
  continuity brief              # print to stdout

  # 5. Paste into your AI assistant and start working.

  # 6. After your session, log what happened:
  continuity log \
    --focus "Implemented auth middleware" \
    --changes "Created src/middleware/auth.ts, updated routes" \
    --decisions "Used JWT over sessions for statelessness" \
    --next "Write tests for token expiry edge cases"

  # 7. Check your context files are healthy:
  continuity doctor

---

## Sample Output

Running `continuity brief` on a real project produces output like this:

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
  ### 2025-06-25 — brief command chosen as v0.2 feature
  Static context assembly to stdout. No AI calls, no API keys.
  Lowest-friction path to useful output in any AI workflow.

  --- Last Session ---
  ### 2025-06-25 — Implemented continuity brief and continuity log
  Focus: Implement brief and log commands.
  Changes: Created brief.ts, session.ts, log.ts, command handlers.
  Next: Add README demo GIF. Write tests.

  === End Brief ===

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

### continuity brief

Reads the /ai directory and prints a compact context summary to stdout.
Skips files that are missing or contain only template placeholder text.

  --no-rules            Omit AGENT_RULES.md from output
  --only <sections>     Include only specific sections
                        Keys: project, arch, tasks, decisions, rules, log
  -d, --dir <path>      Target a different project directory

  continuity brief
  continuity brief | pbcopy
  continuity brief --only project,tasks
  continuity brief --no-rules

### continuity log

Appends a structured session entry to ai/SESSION_LOG.md.

  --focus <text>        What the session focused on (required)
  --changes <text>      Summary of what changed (required)
  --decisions <text>    Decisions made, or "none" (required)
  --next <text>         What the next session should pick up (required)
  --date <YYYY-MM-DD>   Override today's date (optional)
  -d, --dir <path>      Target a different project directory

  continuity log \
    --focus "Implemented auth middleware" \
    --changes "Created src/middleware/auth.ts, updated routes" \
    --decisions "Used JWT over sessions for statelessness" \
    --next "Write tests for token expiry edge cases"

### continuity doctor

Checks the health of your /ai context files and reports which are missing,
empty, or healthy.

  -d, --dir <path>      Target a different project directory

  continuity doctor

  Exit code 0 if all files are healthy. Exit code 1 if any are missing or empty.
  Safe to use in CI pipelines.

---

## Install

  npm install -g continuity

Or use without installing:

  npx continuity init
  npx continuity brief

---

## The /ai Directory

The /ai directory is designed to be committed to your repository. It is the
source of truth for project context that works equally well for humans and AI.

Keep it updated as the project evolves. Use `continuity doctor` to check its health.
Use `continuity log` after significant sessions to keep SESSION_LOG.md current.

---

## Roadmap

  Phase     Feature
  -------   -------------------------------------------------------
  MVP       init command, /ai scaffolding
  v0.2      brief and log commands
  v0.3      doctor command, README and npm publish
  v0.4      MCP server — agents pull context automatically
  v1.0      Stable API, plugin system, team sharing

---

## License

MIT
