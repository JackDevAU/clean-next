import consola from "consola";
import { execa } from "execa";
import {
	AddPackageToConfig,
	CheckConfig,
	type ConfigOptions,
} from "../../../util/config.js";
import {
	InstallDev,
	updateJsonFile,
	updatePackageJson,
} from "../../../util/index.js";
import { CommandName } from "../index.js";

export const description = "Add biomejs to your Next.js project";

const commands = (packageManager: string): [string, string[]] => {
	switch (packageManager) {
		case "pnpm":
			return ["pnpm", ["biome", "init"]];
		case "yarn":
			return ["yarn", ["biome", "init"]];
		case "npm":
			return ["npx", ["@biomejs/biome", "init"]];
		default:
			return ["bunx", ["@biomejs/biome", "init"]];
	}
};

export const addBiomejsAction = async () => {
	consola.log("Adding Biomejs to your Next.js project...");
	let config: ConfigOptions;
	try {
		config = await CheckConfig(CommandName.biomejs);
	} catch (error) {
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return;
	}

	consola.info("Initializing Biomejs in your Next.js project...");
	try {
		// Install Biomejs as a dev dependency
		const [command, initialArgs = []] = InstallDev(config.packageManager);
		await execa(command, [...initialArgs, "@biomejs/biome"], {
			stdio: "inherit",
		});

		// Init Biomejs
		const [biomeCommand, biomeArgs] = commands(config.packageManager);
		await execa(biomeCommand, [...biomeArgs], {
			stdio: "inherit",
		});

		await updateJsonFile("biome.json", {
			css: {
				formatter: {
					enabled: true,
				},
				linter: {
					enabled: true,
				},
			},
		});

		// Add and overwrite package.json scripts
		await updatePackageJson({
			scripts: {
				format: "biome check . --write",
				lint: "biome check .",
			},
		});

		consola.success("Biomejs has been successfully initialized!");
		await AddPackageToConfig(CommandName.biomejs);
	} catch (error) {
		if (error instanceof Error) {
			consola.error("Failed to initialize Biomejs:", error.message);
		}
	}
};
