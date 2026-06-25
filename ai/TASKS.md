# Tasks

## Active

- [ ] Publish to npm (run pnpm publish)
- [ ] Record README demo GIF showing brief | pbcopy and MCP workflows

## Backlog

- [ ] continuity init --interactive — guided setup that prompts for project info
- [ ] continuity watch — auto-append session log entries on file save
- [ ] Editor plugin — VS Code extension that injects brief at session start
- [ ] continuity sync — push /ai context to a shared store for teams
- [ ] Web dashboard — visualize session log and decisions over time

## Done

- [x] MVP CLI skeleton with continuity init command
- [x] continuity brief — context assembly to stdout
- [x] continuity brief --format json — machine-readable output
- [x] continuity log — append session entries to SESSION_LOG.md
- [x] continuity doctor — validate /ai file health
- [x] MCP server — continuity mcp with get_brief, get_file, log_session, update_file
- [x] Tests for brief, session, content, log
- [x] GitHub Actions CI
- [x] LICENSE, CONTRIBUTING.md, CHANGELOG.md
- [x] npm publish readiness (version 0.4.0)
- [x] README overhaul with MCP setup guide
