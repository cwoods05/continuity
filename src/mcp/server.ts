import { readFile } from "node:fs/promises";
import path from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { generateBrief } from "../lib/ai/brief.js";
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
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "get_brief") {
      const result = await generateBrief(projectDirectory, { includeRules: true });
      return {
        content: [{ type: "text", text: result.content }],
      };
    }

    if (request.params.name === "get_file") {
      const args = request.params.arguments ?? {};
      const filename =
        typeof args.filename === "string" ? args.filename : undefined;

      if (!filename || !ALLOWED_FILES_SET.has(filename)) {
        return {
          content: [{ type: "text", text: ALLOWED_FILES_MESSAGE }],
          isError: true,
        };
      }

      const filePath = path.join(projectDirectory, "ai", filename);

      try {
        const fileContent = await readFile(filePath, "utf8");
        return {
          content: [{ type: "text", text: fileContent }],
        };
      } catch {
        return {
          content: [{ type: "text", text: `File not found: ${filename}` }],
          isError: true,
        };
      }
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${request.params.name}` }],
      isError: true,
    };
  });

  const transport = new StdioServerTransport();

  const serverClosed = new Promise<void>((resolve) => {
    transport.onclose = () => resolve();
  });

  await server.connect(transport);
  await serverClosed;
}
