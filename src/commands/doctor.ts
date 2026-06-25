import { access } from "node:fs/promises";
import path from "node:path";
import type { Command } from "commander";
import { runDoctor } from "../lib/ai/doctor.js";
import { AI_DIRECTORY_NAME } from "../lib/ai/templates.js";

const FILENAME_WIDTH = 20;

function formatReportLine(filename: string, status: string): string {
  return `  ${filename.padEnd(FILENAME_WIDTH)}${status}`;
}

export function registerDoctorCommand(program: Command): void {
  program
    .command("doctor")
    .description("Check the health of your /ai context files")
    .option("-d, --dir <path>", "target project directory", process.cwd())
    .action(async (options: { dir: string }) => {
      const aiDirectory = path.resolve(options.dir, AI_DIRECTORY_NAME);

      try {
        await access(aiDirectory);
      } catch {
        console.error(`Error: No /ai directory found at ${aiDirectory}`);
        process.exit(1);
      }

      const result = await runDoctor(options.dir);
      const lines: string[] = ["continuity doctor", ""];

      for (const report of result.reports) {
        if (report.status === "healthy") {
          lines.push(formatReportLine(report.filename, "✓ healthy"));
        } else {
          lines.push(
            formatReportLine(
              report.filename,
              `✗ ${report.status} — ${report.reason}`,
            ),
          );
        }
      }

      lines.push("");
      lines.push(
        `  ${result.healthyCount} of ${result.reports.length} files healthy`,
      );

      if (result.missingCount > 0 || result.emptyCount > 0) {
        lines.push("");

        if (result.missingCount > 0) {
          lines.push("  Run `continuity init` to create any missing files.");
        }

        if (result.emptyCount > 0) {
          lines.push(
            "  Fill in empty files to improve brief output quality.",
          );
        }
      }

      console.log(lines.join("\n"));

      if (!result.allHealthy) {
        process.exit(1);
      }
    });
}
