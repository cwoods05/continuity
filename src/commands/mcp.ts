import type { Command } from "commander";
import { startMcpServer } from "../mcp/server.js";

export function registerMcpCommand(program: Command): void {
  program
    .command("mcp")
    .description("Start an MCP server that exposes Continuity context to AI agents")
    .option("-d, --dir <path>", "target project directory", process.cwd())
    .action(async (options: { dir: string }) => {
      try {
        await startMcpServer(options.dir);
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : String(error),
        );
        process.exit(1);
      }
    });
}
