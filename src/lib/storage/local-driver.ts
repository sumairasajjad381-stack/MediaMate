import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Readable } from "stream";
import { IStorageDriver, StoredFileMetadata } from "./driver.interface";
import { logger } from "../logger";

export class LocalStorageDriver implements IStorageDriver {
  public name = "LOCAL";
  private baseDir: string;

  constructor(baseDir = "./storage/media") {
    this.baseDir = path.resolve(process.cwd(), baseDir);
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async saveFromStream(
    remoteStream: ReadableStream<Uint8Array> | NodeJS.ReadableStream,
    destinationFilename: string,
    mimeType: string
  ): Promise<StoredFileMetadata> {
    const safeFilename = path.basename(destinationFilename);
    const destinationPath = path.join(this.baseDir, safeFilename);
    const hash = crypto.createHash("sha256");
    let totalBytes = 0;

    const writeStream = fs.createWriteStream(destinationPath);

    return new Promise<StoredFileMetadata>((resolve, reject) => {
      // If it's a web standard ReadableStream, convert to node stream
      let nodeStream: NodeJS.ReadableStream;
      if ("getReader" in remoteStream) {
        nodeStream = Readable.fromWeb(remoteStream as any);
      } else {
        nodeStream = remoteStream as NodeJS.ReadableStream;
      }

      nodeStream.on("data", (chunk: Buffer) => {
        hash.update(chunk);
        totalBytes += chunk.length;
      });

      nodeStream.on("error", (err) => {
        writeStream.destroy();
        // Remove partial file
        if (fs.existsSync(destinationPath)) {
          fs.unlinkSync(destinationPath);
        }
        reject(err);
      });

      writeStream.on("error", (err) => {
        reject(err);
      });

      writeStream.on("finish", () => {
        const checksumSha256 = hash.digest("hex");
        logger.info(`Saved media to local storage`, {
          filename: safeFilename,
          sizeBytes: totalBytes,
          checksum: checksumSha256,
        });
        resolve({
          storagePath: safeFilename,
          sizeBytes: totalBytes,
          mimeType,
          checksumSha256,
        });
      });

      nodeStream.pipe(writeStream);
    });
  }

  async getStream(storagePath: string): Promise<NodeJS.ReadableStream> {
    const safeFilename = path.basename(storagePath);
    const fullPath = path.join(this.baseDir, safeFilename);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found in local storage: ${safeFilename}`);
    }
    return fs.createReadStream(fullPath);
  }

  async exists(storagePath: string): Promise<boolean> {
    const safeFilename = path.basename(storagePath);
    const fullPath = path.join(this.baseDir, safeFilename);
    return fs.existsSync(fullPath);
  }

  async delete(storagePath: string): Promise<boolean> {
    const safeFilename = path.basename(storagePath);
    const fullPath = path.join(this.baseDir, safeFilename);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      return true;
    }
    return false;
  }

  getUrl(storagePath: string): string {
    const safeFilename = path.basename(storagePath);
    return `/api/media/stream/${encodeURIComponent(safeFilename)}`;
  }
}
