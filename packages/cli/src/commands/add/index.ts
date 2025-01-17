import type { Command } from "commander";
import consola from "consola";
import { addAzureBlobAction } from "./azure-blob-storage/index.js";
import { addBiomejsAction } from "./biomejs/index.js";
import { addNextAuthAction } from "./next-auth/index.js";
import { addShadcnuiAction } from "./shadcnui/index.js";
import { addTinaCMSAction } from "./tinacms/index.js";
import { addVSCodeAction } from "./vscode/index.js";

export const CommandName = {
	shadcnui: "shadcnui",
	biomejs: "biomejs",
	vscode: "vscode",
	nextAuth: "nextAuth",
	tinacms: "tinacms",
	azureblob: "azureblob",
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
				case CommandName.nextAuth:
					await addNextAuthAction();
					break;
				case CommandName.tinacms:
					await addTinaCMSAction();
					break;
				case CommandName.azureblob:
					await addAzureBlobAction();
					break;
				default:
					consola.error(`Unknown package: ${input}`);
					break;
			}
		});
}
