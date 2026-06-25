import { Command } from "commander";
import { registerInitCommand } from "./commands/init.js";
import { readPackageJson } from "./utils/package.js";

export function runCli(argv: string[]): void {
  const pkg = readPackageJson();

  const program = new Command();

  program
    .name("continuity")
    .description("Maintain project continuity across AI coding sessions")
    .version(pkg.version);

  registerInitCommand(program);

  program.parse(argv);
}
