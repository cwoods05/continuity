import type { Command } from "commander";
import { appendSessionEntry } from "../lib/ai/log.js";

export function registerLogCommand(program: Command): void {
  program
    .command("log")
    .description("Append a session entry to SESSION_LOG.md")
    .option("-d, --dir <path>", "target project directory", process.cwd())
    .option("--focus <text>", "what the session focused on")
    .option("--changes <text>", "summary of what was changed")
    .option("--decisions <text>", 'decisions made, or "none"')
    .option("--next <text>", "what the next session should pick up")
    .option("--date <YYYY-MM-DD>", "override today's date")
    .action(
      async (options: {
        dir: string;
        focus?: string;
        changes?: string;
        decisions?: string;
        next?: string;
        date?: string;
      }) => {
        const missing: string[] = [];

        if (!options.focus) {
          missing.push("--focus");
        }
        if (!options.changes) {
          missing.push("--changes");
        }
        if (!options.decisions) {
          missing.push("--decisions");
        }
        if (!options.next) {
          missing.push("--next");
        }

        if (missing.length > 0) {
          console.error(
            `Error: Missing required option(s): ${missing.join(", ")}`,
          );
          process.exit(1);
        }

        const entryOptions: {
          focus: string;
          changes: string;
          decisions: string;
          next: string;
          date?: string;
        } = {
          focus: options.focus!,
          changes: options.changes!,
          decisions: options.decisions!,
          next: options.next!,
        };

        if (options.date) {
          entryOptions.date = options.date;
        }

        try {
          const result = await appendSessionEntry(options.dir, entryOptions);
          console.log(`Session entry added to ${result.filePath}`);
        } catch (error) {
          console.error(
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      },
    );
}
