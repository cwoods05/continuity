import { Command } from "commander";
import { registerBriefCommand } from "./commands/brief.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerInitCommand } from "./commands/init.js";
import { registerLogCommand } from "./commands/log.js";
import { readPackageJson } from "./utils/package.js";

export function runCli(argv: string[]): void {
  const pkg = readPackageJson();

  const program = new Command();

  program
    .name("continuity")
    .description("Maintain project continuity across AI coding sessions")
    .version(pkg.version);

  registerInitCommand(program);
  registerBriefCommand(program);
  registerLogCommand(program);
  registerDoctorCommand(program);

  program.parse(argv);
}
