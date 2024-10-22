import consola from "consola";
import { execa } from "execa";
import {
	AddPackageToConfig,
	CheckConfig,
	type ConfigOptions,
} from "../../../util/config.js";
import { RemoteInstall, TryRemoveFile } from "../../../util/index.js";
import { CommandName } from "../index.js";

export const description = "Add TinaCMS to your Next.js project";

export const addTinaCMSAction = async () => {
	consola.log("Adding TinaCMS to your Next.js project...");
	let config: ConfigOptions;
	try {
		config = await CheckConfig(CommandName.tinacms);
	} catch (error) {
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return;
	}

	consola.info("Initializing TinaCMS in your Next.js project...");
	try {
		const [command, initialArgs] = RemoteInstall(config.packageManager);
		await execa(command, [...initialArgs, "@tinacms/cli@latest", "init"], {
			stdio: "inherit",
		});

		//! Tech Debt - Remove the pages/ file created by TinaCMS init command
		// Adding file at pages/demo/blog/[filename].tsx... ✅
		await TryRemoveFile("pages/demo/blog/[filename].tsx");

		//? Should we add an example here? i.e. a posts page and a /posts/[slug] page?
		consola.success("TinaCMS has been successfully initialized!");
		await AddPackageToConfig(CommandName.tinacms);
	} catch (error) {
		if (error instanceof Error) {
			consola.error("Failed to initialize the TinaCMS:", error.message);
		}
	}
};
