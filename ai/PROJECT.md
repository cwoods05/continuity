# Project

## Overview

Continuity is a CLI tool that gives AI coding assistants persistent project memory.
It scaffolds a small /ai directory in any repository, which developers fill in once.
From then on, a single command generates a compact context brief that can be pasted
into any AI assistant — Cursor, Claude, ChatGPT, Copilot, or any future agent.

## Goals

- Make it effortless for developers to give AI assistants accurate project context
- Work with every AI tool without requiring API keys or proprietary integrations
- Establish the /ai directory as a standard convention for AI-assisted repositories
- Build a habit loop: init → brief → work → log → repeat

## Non-Goals

- Continuity is not an AI assistant itself
- Continuity does not call any AI APIs
- Continuity is not a documentation generator
- Continuity does not replace human-written documentation

## Key Constraints

- Must work without API keys or background services
- Output must be model-agnostic plain text
- CLI must be installable globally via npm in one command
- Every feature must be demoable without a paid subscription to anything

## Stakeholders

Developers using AI coding assistants who want their agents to stay aligned across
sessions, tools, and time.
