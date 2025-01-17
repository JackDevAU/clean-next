import consola from "consola";
import inquirer from "inquirer";
import {
	AddPackageToConfig,
	CheckConfig,
	type ConfigOptions,
} from "../../../util/config.js";
import { TryWriteFileAndAppend } from "../../../util/index.js";
import { CommandName } from "../index.js";
import { blobPOST } from "./generators/blob-create.js";
import { blobDELETE } from "./generators/blob-delete.js";

export const description = "Add Azure Blob to your Next.js project";

export const addAzureBlobAction = async () => {
	consola.log("Adding Azure Blob to your Next.js project...");
	let config: ConfigOptions;
	try {
		config = await CheckConfig(CommandName.azureblob);
	} catch (error) {
		if (error instanceof Error) {
			consola.error(error.message);
		}
		return;
	}

	try {
		const { operations } = await inquirer.prompt([
			{
				type: "checkbox",
				name: "operations",
				message: "Select the operations to add:",
				choices: [
					{ name: "GET - Fetch Blob", value: "get" },
					{ name: "CREATE - Upload Blob", value: "create" },
					{ name: "DELETE - Remove Blob", value: "delete" },
				],
			},
		]);

		if (operations.length === 0) {
			consola.warn(
				"No operations selected. You must select at least one operation.",
			);
			return;
		}

		// Imports
		await TryWriteFileAndAppend(
			"app/api/blob",
			"route.tsx",
			`import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";`,
		);

		if (operations.includes("get")) {
			// app/api/blob/route.tsx + add blobGET
			consola.warn(
				"TODO: Implement logic for storage GET operation to the project",
			);
			// await TryWriteFileAndAppend("app/api/blob", "route.tsx", blobGET);
		}

		if (operations.includes("create")) {
			// app/api/blob/route.tsx + add blobPOST
			await TryWriteFileAndAppend("app/api/blob", "route.tsx", blobPOST);
		}

		if (operations.includes("delete")) {
			// app/api/blob/route.tsx + add blobDELETE
			await TryWriteFileAndAppend("app/api/blob", "route.tsx", blobDELETE);
		}

		consola.success("Azure Blob has been successfully initialized!");
		await AddPackageToConfig(CommandName.azureblob);
	} catch (error) {
		if (error instanceof Error) {
			consola.error("Failed to initialize the Azure Blob:", error.message);
		}
	}
};
