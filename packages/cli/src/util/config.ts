import { promises as fs } from "node:fs";
import path from "node:path";
import invariant from "tiny-invariant";

// TODO: Make Packages an array of objects with name and version
export interface ConfigOptions {
	packageManager: string;
	packages?: string[];
}

const GetConfig = async () => {
	const configPath = path.resolve(process.cwd(), "clean-next.config.json");
	try {
		const config = await fs.readFile(configPath, "utf-8");
		return JSON.parse(config) as ConfigOptions;
	} catch (error) {
		return null;
	}
};

export const AddPackageToConfig = async (packageToAdd: string) => {
	const config = await GetConfig();
	if (!config) {
		return;
	}

	if (!config.packages) {
		config.packages = [];
	}

	config.packages.push(packageToAdd);

	const configPath = path.resolve(process.cwd(), "clean-next.config.json");
	await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
};

export const CheckConfig = async (
	packageName: string,
): Promise<ConfigOptions> => {
	const config = await GetConfig();
	invariant(
		config,
		"No config file found. Run `clean-next init` to create one.",
	);
	invariant(
		!config.packages?.includes(packageName),
		`Package ${packageName} already installed.`,
	);

	return config;
};
