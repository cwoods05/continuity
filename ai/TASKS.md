# Tasks

## Active

- [ ] Create GitHub repository and push all code
- [ ] Run npm login and pnpm publish --access public
- [ ] Replace all TODO_REPLACE_USERNAME placeholders in package.json, README, CONTRIBUTING
- [ ] Record demo GIF: continuity init -i followed by continuity brief | pbcopy
- [ ] Share with 5 real developers and collect feedback via GitHub issues

## Backlog

- [ ] continuity watch — auto-append session log entries on file save
- [ ] Editor plugin — VS Code extension that injects brief at session start
- [ ] continuity sync — push /ai context to a shared store for teams
- [ ] Remote MCP transport (HTTP/SSE) for agents that cannot spawn local processes

## Done

- [x] MVP CLI skeleton with continuity init command
- [x] continuity brief — context assembly to stdout
- [x] continuity brief --format json — machine-readable output
- [x] continuity log — append session entries to SESSION_LOG.md
- [x] continuity doctor — validate /ai file health
- [x] MCP server — continuity mcp with get_brief, get_file, log_session, update_file
- [x] continuity mcp init — zero-friction MCP setup for Claude Desktop and Cursor
- [x] Tests for brief, session, content, log
- [x] GitHub Actions CI
- [x] LICENSE, CONTRIBUTING.md, CHANGELOG.md
- [x] Renamed npm package to @continuityai/cli (binary stays "continuity")
- [x] npm publish readiness (version 0.5.1)
- [x] README overhaul with sample output and MCP setup guide
- [x] continuity init --interactive — guided setup with project pre-fill
