import type { Command } from "commander";
import {
  initializeAiDirectory,
  writeInteractiveProjectFile,
} from "../lib/ai/init.js";
import { ask, closePrompt } from "../utils/prompt.js";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Create the /ai directory and scaffold continuity files")
    .option("-d, --dir <path>", "target project directory", process.cwd())
    .option(
      "-i, --interactive",
      "prompt for project details and pre-fill PROJECT.md",
    )
    .action(async (options: { dir: string; interactive?: boolean }) => {
      let interactiveAnswers:
        | {
            projectName: string;
            description: string;
            stack: string;
          }
        | undefined;

      if (options.interactive) {
        try {
          const projectName = await ask("Project name:");
          const description = await ask(
            "What does this project do? (one sentence):",
          );
          const stack = await ask("Primary language / stack:");

          interactiveAnswers = { projectName, description, stack };
        } catch (error) {
          console.error(
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        } finally {
          closePrompt();
        }
      }

      const result = await initializeAiDirectory(options.dir);

      if (interactiveAnswers) {
        try {
          await writeInteractiveProjectFile(options.dir, interactiveAnswers);
        } catch (error) {
          console.error(
            error instanceof Error ? error.message : String(error),
          );
          process.exit(1);
        }
      }

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

      if (interactiveAnswers) {
        console.log("✔ PROJECT.md pre-filled with your project details");
      }
    });
}
