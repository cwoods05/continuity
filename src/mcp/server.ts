import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { generateBrief } from "../lib/ai/brief.js";
import { appendSessionEntry } from "../lib/ai/log.js";
import { readPackageJson } from "../utils/package.js";

const ALLOWED_FILES = [
  "PROJECT.md",
  "ARCHITECTURE.md",
  "TASKS.md",
  "DECISIONS.md",
  "AGENT_RULES.md",
  "SESSION_LOG.md",
] as const;

const ALLOWED_FILES_SET = new Set<string>(ALLOWED_FILES);

const ALLOWED_FILES_MESSAGE =
  "Unknown file. Valid files are: PROJECT.md, ARCHITECTURE.md, TASKS.md, DECISIONS.md, AGENT_RULES.md, SESSION_LOG.md";

function toolError(text: string) {
  return {
    content: [{ type: "text" as const, text }],
    isError: true,
  };
}

function toolSuccess(text: string) {
  return {
    content: [{ type: "text" as const, text }],
  };
}

export async function startMcpServer(projectDirectory: string): Promise<void> {
  const pkg = readPackageJson();

  const server = new Server(
    { name: "continuity", version: pkg.version },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "get_brief",
        description:
          "Get a compact context brief for this project, including goals, architecture, active tasks, recent decisions, and last session summary.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_file",
        description:
          "Get the raw content of a specific file from the project's /ai directory.",
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description:
                "The filename to read, e.g. PROJECT.md, TASKS.md, DECISIONS.md, ARCHITECTURE.md, AGENT_RULES.md, SESSION_LOG.md",
            },
          },
          required: ["filename"],
        },
      },
      {
        name: "log_session",
        description: "Append a session log entry to ai/SESSION_LOG.md",
        inputSchema: {
          type: "object",
          properties: {
            focus: {
              type: "string",
              description: "What the session focused on",
            },
            changes: {
              type: "string",
              description: "Summary of what changed",
            },
            decisions: {
              type: "string",
              description: 'Decisions made, or "none"',
            },
            next: {
              type: "string",
              description: "What the next session should pick up",
            },
            date: {
              type: "string",
              description:
                "ISO date string override (YYYY-MM-DD), defaults to today",
            },
          },
          required: ["focus", "changes", "decisions", "next"],
        },
      },
      {
        name: "update_file",
        description: "Overwrite a specific /ai file with new content",
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description:
                "One of: PROJECT.md, ARCHITECTURE.md, TASKS.md, DECISIONS.md, AGENT_RULES.md, SESSION_LOG.md",
            },
            content: {
              type: "string",
              description: "Full new content for the file",
            },
          },
          required: ["filename", "content"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "get_brief") {
      const result = await generateBrief(projectDirectory, { includeRules: true });
      return toolSuccess(result.content);
    }

    if (request.params.name === "get_file") {
      const args = request.params.arguments ?? {};
      const filename =
        typeof args.filename === "string" ? args.filename : undefined;

      if (!filename || !ALLOWED_FILES_SET.has(filename)) {
        return toolError(ALLOWED_FILES_MESSAGE);
      }

      const filePath = path.join(projectDirectory, "ai", filename);

      try {
        const fileContent = await readFile(filePath, "utf8");
        return toolSuccess(fileContent);
      } catch {
        return toolError(`File not found: ${filename}`);
      }
    }

    if (request.params.name === "log_session") {
      const args = request.params.arguments ?? {};
      const focus = typeof args.focus === "string" ? args.focus : undefined;
      const changes =
        typeof args.changes === "string" ? args.changes : undefined;
      const decisions =
        typeof args.decisions === "string" ? args.decisions : undefined;
      const next = typeof args.next === "string" ? args.next : undefined;

      if (!focus || !changes || !decisions || !next) {
        return toolError(
          "Missing required fields: focus, changes, decisions, and next are all required.",
        );
      }

      const entryOptions: {
        focus: string;
        changes: string;
        decisions: string;
        next: string;
        date?: string;
      } = { focus, changes, decisions, next };

      if (typeof args.date === "string") {
        entryOptions.date = args.date;
      }

      try {
        const result = await appendSessionEntry(projectDirectory, entryOptions);
        return toolSuccess(
          `Session entry added to ${result.filePath}`,
        );
      } catch (error) {
        return toolError(
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    if (request.params.name === "update_file") {
      const args = request.params.arguments ?? {};
      const filename =
        typeof args.filename === "string" ? args.filename : undefined;
      const content =
        typeof args.content === "string" ? args.content : undefined;

      if (!filename || !ALLOWED_FILES_SET.has(filename)) {
        return toolError(ALLOWED_FILES_MESSAGE);
      }

      if (content === undefined) {
        return toolError("Missing required field: content");
      }

      const filePath = path.join(projectDirectory, "ai", filename);

      try {
        await writeFile(filePath, content, "utf8");
        return toolSuccess(`Updated ${filePath}`);
      } catch (error) {
        return toolError(
          error instanceof Error ? error.message : String(error),
        );
      }
    }

    return toolError(`Unknown tool: ${request.params.name}`);
  });

  const transport = new StdioServerTransport();

  const serverClosed = new Promise<void>((resolve) => {
    transport.onclose = () => resolve();
  });

  await server.connect(transport);
  await serverClosed;
}
