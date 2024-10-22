import consola from "consola";
import { CheckConfig, type ConfigOptions } from "../../../util/config.js";
import { CommandName } from "../index.js";

export const description = "Add Next Auth to your Next.js project";

export const addNextAuthAction = async () => {
	consola.log("Adding Next Auth to your Next.js project...");
	let config: ConfigOptions;
	try {
		config = await CheckConfig(CommandName.nextAuth);
	} catch (error) {
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return;
	}
};
