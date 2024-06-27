// index.ts
import { Command } from "commander";
import { addCommand } from "./commands/add/index.js";
import { initCommand } from "./commands/init/index.js";

const program = new Command();
program.name("Clean Next").description("Clean Next CLI").version("0.0.1");

initCommand(program);
addCommand(program);

program.parse(process.argv);

process.on("SIGINT", () => {
	process.exit();
});
