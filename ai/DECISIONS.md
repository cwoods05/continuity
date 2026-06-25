# Decisions

Record significant technical and product decisions here. Prefer short, dated entries.

## Log

### 2025-06-25 — brief command chosen as v0.2 feature

**Context:** Needed first "active" feature to make /ai directory useful during AI sessions.

**Decision:** continuity brief — static context assembly to stdout. No AI calls, no API keys, no daemons.

**Rationale:** Lowest-friction path to useful output in any AI workflow. Pipeable to clipboard. Works with every agent. Establishes the core habit that future features build on.

**Consequences:** Requires a manual copy-paste step. Acceptable for v0.2. Auto-injection via MCP or editor plugins is a v0.4+ concern.

---
