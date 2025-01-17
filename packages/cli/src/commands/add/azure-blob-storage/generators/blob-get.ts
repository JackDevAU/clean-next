export const blobGET = `

export const GET = async (req: Request) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!,
    );

    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME!;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const params = new URL(req.url);
    let imagePath = params.pathname.startsWith("/")
      ? params.pathname.slice(1)
      : params.pathname;

    if (!imagePath) {
      return NextResponse.json({ message: "no image" }, { status: 404 });
    }

    const blobClient = containerClient.getBlobClient(imagePath);
    const downloadBlockBlobResponse = await blobClient.download();
    const blobContentType = downloadBlockBlobResponse.contentType || "image/jpeg";

    const buffer = await blobClient.downloadToBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": blobContentType,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
};
`;
