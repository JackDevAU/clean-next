export const blobDELETE = `

export const DELETE = async (req: Request) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!,
    );

    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Assuming the image path is passed as a query parameter, e.g., ?path=<container-name>/<image>.<extension eg.jpeg>
    const urlParams = new URL(req.url).searchParams;
    const imagePath = urlParams.get('path'); // Extract the image path

    if (!imagePath) {
      return NextResponse.json({ message: "No image path provided" }, { status: 400 });
    }

    // Get the blob client for the image path
    const blobClient = containerClient.getBlobClient(imagePath);
    await blobClient.delete();

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
`;
