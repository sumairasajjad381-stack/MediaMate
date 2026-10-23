import { Readable } from "stream";

export interface StoredFileMetadata {
  storagePath: string;
  sizeBytes: number;
  mimeType: string;
  checksumSha256: string;
}

export interface IStorageDriver {
  name: string;
  
  /**
   * Stream a remote media URL into the storage driver.
   * Computes SHA-256 checksum on the fly to avoid buffering entire file in memory.
   */
  saveFromStream(
    remoteStream: ReadableStream<Uint8Array> | NodeJS.ReadableStream,
    destinationFilename: string,
    mimeType: string
  ): Promise<StoredFileMetadata>;

  /**
   * Retrieve file as a readable node stream for download
   */
  getStream(storagePath: string): Promise<NodeJS.ReadableStream>;

  /**
   * Check if file exists
   */
  exists(storagePath: string): Promise<boolean>;

  /**
   * Delete a file
   */
  delete(storagePath: string): Promise<boolean>;

  /**
   * Get public or stream URL for the stored media
   */
  getUrl(storagePath: string): string;
}
