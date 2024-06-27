import consola from "consola";
import { execa } from "execa";
import {
	AddPackageToConfig,
	CheckConfig,
	type ConfigOptions,
} from "../../../util/config.js";
import { Install, RemoteInstall, TryWriteFile } from "../../../util/index.js";
import { CommandName } from "../index.js";
import { cleanNextShadcnuiInstall } from "./default.js";
import { layoutGenerator } from "./generators/layout.js";
import { tailwindConfigGenerator } from "./generators/tailwind.config.js";
import { themeProviderGenerator } from "./generators/theme.provider.js";

export const description = "shadcn/ui to your Next.js project";

export const addShadcnuiAction = async ({ manual }: { manual: boolean }) => {
	consola.log("Adding Shadcn/ui to your Next.js project...");
	let config: ConfigOptions;
	try {
		config = await CheckConfig(CommandName.shadcnui);
	} catch (error) {
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return;
	}

	consola.info("Initializing Shadcn/ui in your Next.js project...");
	try {
		if (manual) {
			const [command, initialArgs] = RemoteInstall(config.packageManager);
			await execa(command, [...initialArgs, "shadcn-ui@latest", "init"], {
				stdio: "inherit",
			});
		} else {
			await cleanNextShadcnuiInstall(config.packageManager, config);
		}

		// Add next-themes for dark mode etc.
		const [nextCommand, nextInstallCommands] = Install(config.packageManager);
		await execa(nextCommand, [...nextInstallCommands, "next-themes"], {
			stdio: "inherit",
		});
		// Create files.
		// components/theme-provider.tsx

		await TryWriteFile(
			"components",
			"theme-provider.tsx",
			themeProviderGenerator,
		);

		// Update files.
		// app/layout.tsx
		await TryWriteFile("app", "layout.tsx", layoutGenerator);

		// tailwind.config.ts
		await TryWriteFile("", "tailwind.config.ts", tailwindConfigGenerator);

		consola.success("Shadcn/ui has been successfully initialized!");
		await AddPackageToConfig(CommandName.shadcnui);
	} catch (error) {
		if (error instanceof Error) {
			consola.error("Failed to initialize the Shadcn/ui:", error.message);
		}
	}
};
