import { execa } from "execa";
import type { ConfigOptions } from "../../util/config.js";
import { RemoteInstall, TryWriteFile } from "../../util/index.js";
import { addBiomejsAction } from "../add/biomejs/index.js";
import { addShadcnuiAction } from "../add/shadcnui/index.js";

export const cleanNext = async (
	appName: string,
	packageManager: string,
	config: ConfigOptions,
) => {
	// Create Next.js project
	const [command, initialArgs] = RemoteInstall(packageManager);
	await execa(
		command,
		[
			...initialArgs,
			"create-next-app@14",
			appName,
			"--typescript",
			"--tailwind",
			"--no-eslint",
			"--no-src-dir",
			"--app",
			"--no-import-alias",
		],
		{ stdio: "inherit" },
	);

	// Create the clean-next.config.json file
	await TryWriteFile(
		appName,
		"clean-next.config.json",
		JSON.stringify(config, null, 2),
	);

	// cd into the project directory
	process.chdir(appName);

	// Add Biomejs to the project
	await addBiomejsAction();

	// Add shadcnui to the project
	await addShadcnuiAction({ manual: false });
};
