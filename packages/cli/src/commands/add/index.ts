import { type Command, Option } from "commander";
import consola from "consola";
import { addBiomejsAction } from "./biomejs/index.js";
import { addShadcnuiAction } from "./shadcnui/index.js";
import { addVSCodeAction } from "./vscode/index.js";

export const CommandName = {
	shadcnui: "shadcnui",
	biomejs: "biomejs",
	vscode: "vscode",
};

export function addCommand(program: Command) {
	program
		.command("add <command>")
		.option("--manual", "Manually install each package", true)
		.option("shadcnui", "Add shadcn/ui to your project")
		.description("Add a package to your Next.js project")
		.action(async (input, { manual }) => {
			switch (input) {
				case CommandName.shadcnui:
					await addShadcnuiAction(manual);
					break;
				case CommandName.biomejs:
					await addBiomejsAction();
					break;
				case CommandName.vscode:
					await addVSCodeAction();
					break;
				default:
					consola.error(`Unknown package: ${input}`);
					break;
			}
		});
}
