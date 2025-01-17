export const blobPOST = `import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!,
    );

    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const data = await req.formData();
    const file = data.get("file");

    if (!(file instanceof File) || !file) {
      return NextResponse.json({ message: "Invalid file uploaded" }, { status: 400 });
    }

    // Convert the file to a buffer to upload it to Azure Blob Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const blobName = file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file with proper content type
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file.type, // Ensures correct MIME type is set
      },
    });

    return NextResponse.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error during file upload:", error);
    return NextResponse.json({ message: "Error uploading file", error: (error as Error).message }, { status: 500 });
  }
};

`;
