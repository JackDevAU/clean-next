import fs from "node:fs/promises";
import path from "node:path";
import type { Stream } from "node:stream";
import consola from "consola";

export const RemoteInstall = (packageManager: string): [string, string[]] => {
	switch (packageManager) {
		case "pnpm":
			return ["pnpm", ["dlx"]];
		case "yarn":
			return ["yarn", []];
		case "npm":
			return ["npx", []];
		default:
			return ["bunx", ["--bun"]];
	}
};

export const InstallDev = (packageManager: string): [string, string[]?] => {
	switch (packageManager) {
		case "pnpm":
			return ["pnpm", ["install", "--save-dev"]];
		case "yarn":
			return ["yarn", ["add", "--dev"]];
		case "npm":
			return ["npm", ["install", "--save-dev"]];
		default:
			return ["bun", ["--dev"]];
	}
};

export const Install = (packageManager: string): [string, string[]] => {
	switch (packageManager) {
		case "pnpm":
			return ["pnpm", ["install"]];
		case "yarn":
			return ["yarn", ["add"]];
		case "npm":
			return ["npm", ["install"]];
		default:
			return ["bun", ["add"]];
	}
};

// Function to read the package.json, modify it, and write it back
// biome-ignore lint/suspicious/noExplicitAny: this will be random properies of the package.json
export async function updatePackageJson(overwriteOptions: any) {
	const packageJsonPath = path.join(process.cwd(), "package.json");

	try {
		// Read the package.json file
		const packageJsonData = await fs.readFile(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(packageJsonData);

		// Loop over each key in the overwriteOptions object
		for (const key in overwriteOptions) {
			// If the property exists in packageJson and it's an object, merge it
			if (
				typeof packageJson[key] === "object" &&
				packageJson[key] !== null &&
				!Array.isArray(packageJson[key])
			) {
				packageJson[key] = { ...packageJson[key], ...overwriteOptions[key] };
			} else {
				// Otherwise, set/overwrite the property directly
				packageJson[key] = overwriteOptions[key];
			}
		}

		// Write the updated package.json back to the file system
		await fs.writeFile(
			packageJsonPath,
			JSON.stringify(packageJson, null, 2),
			"utf-8",
		);

		consola.success("package.json has been successfully updated.");
	} catch (error) {
		if (error instanceof Error)
			consola.error("Failed to update package.json:", error.message);
	}
}

/**
 * Updates a JSON file with the provided overwrite options.
 * @param filePath The path to the JSON file relative to the current working directory.
 * @param overwriteOptions The properties to add or overwrite in the JSON file.
 */
// biome-ignore lint/suspicious/noExplicitAny: this will be random properies
export async function updateJsonFile(filePath: string, overwriteOptions: any) {
	const fullPath = path.join(process.cwd(), filePath);

	try {
		// Read the JSON file
		const jsonData = await fs.readFile(fullPath, "utf-8");
		const json = JSON.parse(jsonData);

		// Loop over each key in the overwriteOptions object
		for (const key in overwriteOptions) {
			if (
				typeof json[key] === "object" &&
				json[key] !== null &&
				!Array.isArray(json[key])
			) {
				// Merge object properties
				json[key] = { ...json[key], ...overwriteOptions[key] };
			} else {
				// Set or overwrite the property directly
				json[key] = overwriteOptions[key];
			}
		}

		// Write the updated JSON back to the file system
		await fs.writeFile(fullPath, JSON.stringify(json, null, 2), "utf-8");

		consola.success(`${filePath} has been successfully updated.`);
	} catch (error) {
		if (error instanceof Error)
			consola.error(`Failed to update ${filePath}: ${error.message}`);
	}
}

const writeFile = async (
	filePath: string,
	fileName: string,
	data:
		| string
		| NodeJS.ArrayBufferView
		| Iterable<string | NodeJS.ArrayBufferView>
		| AsyncIterable<string | NodeJS.ArrayBufferView>
		| Stream,
) => {
	const appDirectory = path.resolve(process.cwd(), filePath);
	// Ensure the directory exists or create it
	await fs.mkdir(appDirectory, { recursive: true });
	// Write the file to the directory
	await fs.writeFile(path.join(appDirectory, fileName), data);
};

export const TryWriteFile = async (
	filePath: string,
	fileName: string,
	data:
		| string
		| NodeJS.ArrayBufferView
		| Iterable<string | NodeJS.ArrayBufferView>
		| AsyncIterable<string | NodeJS.ArrayBufferView>
		| Stream,
): Promise<boolean> => {
	try {
		await writeFile(filePath, fileName, data);
		return true;
	} catch (error) {
		if (error instanceof Error) {
			consola.error(`Failed to create ${fileName}: ${error.message}`);
		}
		return false;
	}
};
