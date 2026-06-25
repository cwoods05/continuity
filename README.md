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

  --no-rules            Omit AGENT_RULES.md from output
  --only <sections>     Include only specific sections
                        Keys: project, arch, tasks, decisions, rules, log
  -d, --dir <path>      Target a different project directory

### continuity mcp

Starts an MCP server over stdio. Connect from Claude Desktop, Cursor, or any
MCP-compatible agent. Exposes get_brief and get_file tools.

  -d, --dir <path>      Target project directory

### continuity log

Appends a structured session entry to ai/SESSION_LOG.md.

  --focus <text>        What the session focused on (required)
  --changes <text>      Summary of what changed (required)
  --decisions <text>    Decisions made, or "none" (required)
  --next <text>         What the next session should pick up (required)
  --date <YYYY-MM-DD>   Override today's date (optional)
  -d, --dir <path>      Target a different project directory

### continuity doctor

Checks the health of your /ai context files.

  -d, --dir <path>      Target a different project directory

Exit code 0 if all files are healthy. Exit code 1 if any are missing or empty.

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
