import { access } from "node:fs/promises";
import path from "node:path";
import type { Command } from "commander";
import { generateBrief } from "../lib/ai/brief.js";
import { AI_DIRECTORY_NAME } from "../lib/ai/templates.js";

export function registerBriefCommand(program: Command): void {
  program
    .command("brief")
    .description("Generate a compact context brief for AI coding assistants")
    .option("-d, --dir <path>", "target project directory", process.cwd())
    .option("--no-rules", "omit AGENT_RULES.md from output")
    .option(
      "--only <sections>",
      'comma-separated section keys, e.g. "project,tasks"',
    )
    .action(async (options: { dir: string; rules: boolean; only?: string }) => {
      const aiDirectory = path.resolve(options.dir, AI_DIRECTORY_NAME);

      try {
        await access(aiDirectory);
      } catch {
        console.error(`Error: No /ai directory found at ${aiDirectory}`);
        process.exit(1);
      }

      const briefOptions: {
        includeRules: boolean;
        only?: string[];
      } = {
        includeRules: options.rules,
      };

      if (options.only) {
        briefOptions.only = options.only
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      }

      const result = await generateBrief(options.dir, briefOptions);
      console.log(result.content);
    });
}
