import { prisma } from "../db";
import { getStorageDriver } from "../storage";
import { logger } from "../logger";
import { ExtractedMetadata, ExtractedMediaFile } from "./types";
import { AppError } from "../errors";

export interface DownloadResult {
  jobId: string;
  files: Array<{
    id: string;
    fileType: string;
    downloadUrl: string;
    sizeBytes: number;
    mimeType: string;
  }>;
}

export class MediaDownloader {
  private storage = getStorageDriver();

  /**
   * Processes and downloads all media files from extracted metadata.
   * Creates a DownloadJob and MediaFile records with deduplication.
   */
  async processAndArchive(
    metadata: ExtractedMetadata,
    userId?: string,
    ipAddress?: string
  ): Promise<DownloadResult> {
    // 1. Create initial DownloadJob
    const job = await prisma.downloadJob.create({
      data: {
        url: metadata.url,
        shortcode: metadata.shortcode,
        mediaType: metadata.mediaType,
        status: "PROCESSING",
        authorUsername: metadata.authorUsername,
        authorFullName: metadata.authorFullName,
        authorAvatarUrl: metadata.authorAvatarUrl,
        caption: metadata.caption,
        likeCount: metadata.likeCount,
        commentCount: metadata.commentCount,
        viewCount: metadata.viewCount,
        userId: userId || null,
        ipAddress: ipAddress || null,
      },
    });

    try {
      const savedFiles = [];

      for (let index = 0; index < metadata.files.length; index++) {
        const file = metadata.files[index];
        const fileRecord = await this.downloadSingleFile(job.id, metadata.shortcode, file, index);
        savedFiles.push(fileRecord);
      }

      // Mark job as completed
      await prisma.downloadJob.update({
        where: { id: job.id },
        data: { status: "COMPLETED" },
      });

      return {
        jobId: job.id,
        files: savedFiles,
      };
    } catch (err) {
      logger.error("Download processing failed", err as Error, { jobId: job.id, shortcode: metadata.shortcode });
      await prisma.downloadJob.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          error: (err as Error).message || "Download failed",
        },
      });
      throw new AppError("Failed to download and archive media files.", 500);
    }
  }

  private async downloadSingleFile(
    jobId: string,
    shortcode: string,
    file: ExtractedMediaFile,
    index: number
  ) {
    const ext = file.type === "VIDEO" ? "mp4" : "jpg";
    const filename = `${shortcode}_${index}_${Date.now()}.${ext}`;
    const mimeType = file.type === "VIDEO" ? "video/mp4" : "image/jpeg";

    logger.info(`Fetching remote media stream`, { url: file.url, type: file.type });

    const response = await fetch(file.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!response.ok || !response.body) {
      throw new Error(`Failed to fetch media stream from source: HTTP ${response.status}`);
    }

    // Save using configured storage driver
    const saved = await this.storage.saveFromStream(
      response.body as any,
      filename,
      mimeType
    );

    // Save record to database
    const mediaFile = await prisma.mediaFile.create({
      data: {
        downloadJobId: jobId,
        fileType: file.type,
        originalUrl: file.url,
        storagePath: saved.storagePath,
        storageDriver: this.storage.name,
        mimeType: saved.mimeType,
        sizeBytes: saved.sizeBytes,
        width: file.width || null,
        height: file.height || null,
        checksumSha256: saved.checksumSha256,
      },
    });

    return {
      id: mediaFile.id,
      fileType: mediaFile.fileType,
      downloadUrl: `/api/media/${mediaFile.id}/download`,
      sizeBytes: mediaFile.sizeBytes,
      mimeType: mediaFile.mimeType,
    };
  }
}

export const downloader = new MediaDownloader();
