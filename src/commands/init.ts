import type { Command } from "commander";
import { initializeAiDirectory } from "../lib/ai/init.js";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Create the /ai directory and scaffold continuity files")
    .option("-d, --dir <path>", "target project directory", process.cwd())
    .action(async (options: { dir: string }) => {
      const result = await initializeAiDirectory(options.dir);

      if (result.createdDirectory) {
        console.log(`Created directory: ${result.aiDirectory}`);
      }

      for (const file of result.createdFiles) {
        console.log(`Created file: ${file}`);
      }

      for (const file of result.skippedFiles) {
        console.log(`Skipped (already exists): ${file}`);
      }

      if (result.createdFiles.length === 0 && !result.createdDirectory) {
        console.log("Continuity files are already set up.");
      } else {
        console.log("\nContinuity initialized successfully.");
      }
    });
}
