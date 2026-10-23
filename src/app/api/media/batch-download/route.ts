import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { PassThrough, Readable } from "stream";
import { prisma } from "@/lib/db";
import { getStorageDriver } from "@/lib/storage";
import { BatchDownloadSchema } from "@/lib/security/validator";
import { formatErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = BatchDownloadSchema.parse(body);

    const mediaFiles = await prisma.mediaFile.findMany({
      where: {
        id: { in: validated.mediaFileIds },
      },
      include: {
        job: true,
      },
    });

    if (mediaFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: "No matching media files found" } },
        { status: 404 }
      );
    }

    const storage = getStorageDriver();
    const archive = archiver("zip", { zlib: { level: 6 } });
    const passThrough = new PassThrough();

    archive.pipe(passThrough);

    // Append each file stream asynchronously
    (async () => {
      try {
        for (const file of mediaFiles) {
          try {
            const fileStream = await storage.getStream(file.storagePath);
            const ext = file.fileType === "VIDEO" ? "mp4" : "jpg";
            const filename = `${file.job.shortcode || "media"}_${file.id.slice(0, 6)}.${ext}`;
            archive.append(fileStream as any, { name: filename });
          } catch (e) {
            logger.warn("Skipping unreadable file in batch zip", { fileId: file.id });
          }
        }
        await archive.finalize();
      } catch (err) {
        logger.error("Error finalizing zip archive", err);
        passThrough.destroy(err as Error);
      }
    })();

    const webStream = Readable.toWeb(passThrough);

    return new NextResponse(webStream as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="instagram_archive_${Date.now()}.zip"`,
      },
    });
  } catch (err) {
    const formatted = formatErrorResponse(err);
    return NextResponse.json(formatted, { status: formatted.statusCode });
  }
}
