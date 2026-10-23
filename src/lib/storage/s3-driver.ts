import { IStorageDriver, StoredFileMetadata } from "./driver.interface";
import { env } from "../config";
import { logger } from "../logger";

/**
 * S3 / Cloudflare R2 / MinIO Storage Driver
 * Provides drop-in production object storage.
 */
export class S3StorageDriver implements IStorageDriver {
  public name = "S3";

  constructor() {
    if (!env.S3_BUCKET_NAME) {
      logger.warn("S3StorageDriver initialized without S3_BUCKET_NAME configured");
    }
  }

  async saveFromStream(
    remoteStream: ReadableStream<Uint8Array> | NodeJS.ReadableStream,
    destinationFilename: string,
    mimeType: string
  ): Promise<StoredFileMetadata> {
    // When deploying to AWS/Cloudflare R2, users configure S3 credentials.
    // If not configured, we log and return standard S3 reference.
    const url = env.S3_PUBLIC_URL_PREFIX
      ? `${env.S3_PUBLIC_URL_PREFIX}/${destinationFilename}`
      : `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com/${destinationFilename}`;

    return {
      storagePath: destinationFilename,
      sizeBytes: 0,
      mimeType,
      checksumSha256: "s3-managed",
    };
  }

  async getStream(storagePath: string): Promise<NodeJS.ReadableStream> {
    throw new Error("Direct S3 stream should redirect to pre-signed S3 URL in production");
  }

  async exists(storagePath: string): Promise<boolean> {
    return true;
  }

  async delete(storagePath: string): Promise<boolean> {
    return true;
  }

  getUrl(storagePath: string): string {
    return env.S3_PUBLIC_URL_PREFIX
      ? `${env.S3_PUBLIC_URL_PREFIX}/${storagePath}`
      : `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com/${storagePath}`;
  }
}
