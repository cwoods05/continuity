# Decisions

Record significant technical and product decisions here. Prefer short, dated entries.

## Log

### 2025-06-25 — brief command chosen as v0.2 feature

**Context:** Needed first "active" feature to make /ai directory useful during AI sessions.

**Decision:** continuity brief — static context assembly to stdout. No AI calls, no API keys, no daemons.

**Rationale:** Lowest-friction path to useful output in any AI workflow. Pipeable to clipboard. Works with every agent. Establishes the core habit that future features build on.

**Consequences:** Requires a manual copy-paste step. Acceptable for v0.2. Auto-injection via MCP or editor plugins is a v0.4+ concern.

---

### 2025-06-25 — doctor command design

**Context:** Needed a way for developers to know if their /ai files are actually useful after scaffolding.

**Decision:** continuity doctor — a read-only health check that reports file status and exits with code 1 if any file is unhealthy.

**Rationale:** Closes the feedback loop after init. Tells developers exactly what to fill in. Exit code 1 makes it usable in CI. No state, no side effects.

**Consequences:** None significant. Purely additive.

---

### 2025-06-25 — MCP server as v0.4 feature

**Context:** Copy-paste workflow is functional but requires manual steps. Agents should be able to pull context automatically.

**Decision:** Add continuity mcp command that starts an MCP server over stdio, exposing get_brief and get_file tools.

**Rationale:** MCP is model-agnostic, works with Claude Desktop and Cursor today, requires no API keys, and transforms Continuity from a developer utility into infrastructure. The stdio transport requires no ports, no daemons, no configuration beyond one JSON entry.

**Consequences:** Adds @modelcontextprotocol/sdk as a production dependency. Server is long-running but only while the agent session is active.

---

### 2025-06-25 — log command design

**Context:** Needed a way to close the habit loop after an AI coding session.

**Decision:** continuity log — flag-based CLI command that appends a structured
entry to SESSION_LOG.md. No interactive prompts. Fully scriptable.

**Rationale:** Flag-based input keeps the command pipeable and automation-friendly.
Required fields validated manually to give better error messages than Commander's
built-in handling.

**Consequences:** Slightly verbose to type manually, but easily wrapped in a shell
alias or agent instruction.

---

### 2025-06-25 — createRequire for package.json reading

**Context:** import.meta.url-based path traversal breaks post npm-publish because
the relative path to package.json no longer exists in the installed package layout.

**Decision:** Use createRequire(import.meta.url) to require package.json. Node resolves
this relative to dist/ and finds the package root correctly in all environments.

**Consequences:** Slightly less idiomatic ESM but correct in all deployment contexts.

### 2025-06-25 — MCP write tools: log_session and update_file

**Context:** MCP server was read-only. Agents could pull context but not close the
loop by updating /ai files after a session without developer typing continuity log.

**Decision:** Add log_session and update_file tools to the MCP server. update_file
uses an allowlist of valid filenames to prevent path traversal.

**Consequences:** Agents using Claude Desktop or Cursor can now fully manage project
memory without any manual CLI steps.

---

### 2025-06-25 — scoped package name @continuityai/cli

**Context:** npm package name "continuity" is taken (abandoned 12-year-old package
at 0.0.0 with 0 dependents, but npm will not release it).

**Decision:** Publish as @continuityai/cli. Binary name stays "continuity".

**Rationale:** Scoped packages look intentional. Namespaces future packages like
@continuityai/vscode or @continuityai/sdk. Binary name separation means zero
impact on docs, user commands, or MCP configs.

**Consequences:** Install command is slightly longer (npm install -g @continuityai/cli)
but this is a one-time action. All daily-use commands are unaffected.

---
