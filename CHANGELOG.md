# Changelog

All notable changes to Continuity are documented here.

## [0.4.0] — 2025-06-25

### Added
- continuity mcp — MCP server over stdio exposing get_brief and get_file tools
- MCP setup instructions in README for Claude Desktop and Cursor
- log_session MCP tool — agents can append session log entries automatically
- update_file MCP tool — agents can update /ai files during a session
- continuity brief --format json — machine-readable brief output
- Tests for brief, session extraction, content detection, and log command
- .npmignore, engines field, prepublishOnly script

### Changed
- Filled /ai directory with real project content (no more template placeholders)
- README rewritten with full command reference and MCP setup guide
- package.json updated to version 0.4.0

## [0.3.0] — 2025-06-25

### Added
- continuity doctor — health check for /ai files, exits 1 if unhealthy
- continuity log — append structured session entries to SESSION_LOG.md

## [0.2.0] — 2025-06-25

### Added
- continuity brief — generates compact context brief from /ai directory
- --no-rules, --only, --dir flags
- Pipeable stdout output

## [0.1.0] — 2025-06-25

### Added
- continuity init — scaffolds /ai directory with six template files
- PROJECT.md, ARCHITECTURE.md, TASKS.md, DECISIONS.md, AGENT_RULES.md, SESSION_LOG.md
