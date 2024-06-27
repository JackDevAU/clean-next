import { execa } from "execa";
import type { ConfigOptions } from "../../../util/config.js";
import { RemoteInstall } from "../../../util/index.js";

export const cleanNextShadcnuiInstall = async (
	packageManager: string,
	config: ConfigOptions,
) => {
	const [command, initialArgs = []] = RemoteInstall(config.packageManager);
	await execa(command, [...initialArgs, "shadcn-ui@latest", "init", "-d"], {
		stdio: "inherit",
	});
};
