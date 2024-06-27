import consola from "consola";
import {
	AddPackageToConfig,
	CheckConfig,
	type ConfigOptions,
} from "../../../util/config.js";
import { TryWriteFile } from "../../../util/index.js";
import { CommandName } from "../index.js";

export const addVSCodeAction = async () => {
	consola.log("Adding VS Code to your Next.js project...");
	let config: ConfigOptions;
	try {
		config = await CheckConfig(CommandName.vscode);
	} catch (error) {
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return;
	}

	consola.info("Initializing VS Code in your Next.js project...");
	try {
		// Create a new directory called ".vscode/settings.json"
		const vscodeSettings = {
			"editor.defaultFormatter": "biomejs.biome",
			"editor.formatOnSave": true,
			"editor.codeActionsOnSave": {
				"quickfix.biome": "explicit",
				"source.organizeImports.biome": "explicit",
			},
			"[typescript]": {
				"editor.defaultFormatter": "biomejs.biome",
			},
			"[json]": {
				"editor.defaultFormatter": "biomejs.biome",
			},
			"[typescriptreact]": {
				"editor.defaultFormatter": "biomejs.biome",
			},
			"[css]": {
				"editor.defaultFormatter": "biomejs.biome",
			},
		};

		const createdFile = await TryWriteFile(
			".vscode",
			"settings.json",
			JSON.stringify(vscodeSettings, null, 2),
		);

		if (!createdFile) {
			return;
		}

		consola.success("VS Code has been successfully initialized!");
		await AddPackageToConfig(CommandName.vscode);
	} catch (error) {
		if (error instanceof Error)
			consola.error("Failed to initialize the VS Code:", error.message);
	}
};
