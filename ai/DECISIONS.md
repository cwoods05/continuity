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
