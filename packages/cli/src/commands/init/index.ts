import path from "node:path";
import type { Command } from "commander";
import consola from "consola";
import { execa } from "execa";
import inquirer from "inquirer";
import type { ConfigOptions } from "../../util/config.js";
import { RemoteInstall, TryWriteFile } from "../../util/index.js";
import { cleanNext } from "./default.js";

export function initCommand(program: Command) {
	program
		.command("init")
		.option("--manual", "Manually install each package", false)
		.description("Initialize a new Next.js project with Clean Next CLI")
		.action(async ({ manual }: { manual: boolean }) => {
			const { packageManager } = await inquirer.prompt([
				{
					type: "list",
					name: "packageManager",
					message: "Choose a package manager:",
					choices: ["npm", "pnpm", "yarn", "bun"],
					default: "pnpm",
				},
			]);

			const config: ConfigOptions = {
				packageManager: packageManager,
			};

			const { appName } = await inquirer.prompt([
				{
					type: "input",
					name: "appName",
					message: "Enter the name of your application:",
					default: "clean-next",
				},
			]);

			const appDirectory = path.resolve(process.cwd(), appName);

			consola.info(`Initializing a new Next.js project in ${appDirectory}...`);
			try {
				if (manual) {
					const [command, initialArgs = []] = RemoteInstall(packageManager);

					await execa(
						command,
						[
							...initialArgs,
							"create-next-app@14",
							appName,
							"--typescript",
							"--tailwind",
							"--no-eslint",
						],
						{ stdio: "inherit" },
					);

					// Create the clean-next.config.json file
					await TryWriteFile(
						appName,
						"clean-next.config.json",
						JSON.stringify(config, null, 2),
					);

					consola.success("Next.js project has been successfully initialized!");
				} else {
					await cleanNext(appName, packageManager, config);
					consola.success(
						"Clean Next.js project has been successfully initialized!",
					);
				}
			} catch (error) {
				if (error instanceof Error) {
					consola.error(
						"Failed to initialize the Next.js project:",
						error.message,
					);
				}
			}
		});
}
