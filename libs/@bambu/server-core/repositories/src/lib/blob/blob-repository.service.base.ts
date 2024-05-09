export abstract class BlobRepositoryServiceBase {
  /**
   * Creates a public blob. The filePath is the path to a local file that will be uploaded to the blob storage.
   * The originalFilename is to be some original name of the file, and if it of a supported charset (see ALLOWED_REGEX), it will be preserved and served
   * with the Content-Disposition header.
   * The blob will take on an arbitrary filename and be served with the prvided contentType.
   * The returned string is the URL to the blob.
   */
  abstract CreatePublicBlobFromLocalFile(
    localFilePath: string,
    contentType: string,
    uploadPath?: string,
    originalFilename?: string
  ): Promise<string>;

  abstract DeleteBlob(blobUrl: string, uploadPath?: string): Promise<void>;
}
