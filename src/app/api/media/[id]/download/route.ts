import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStorageDriver } from "@/lib/storage";
import { formatErrorResponse, NotFoundError } from "@/lib/errors";
import { Readable } from "stream";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!mediaFile) {
      throw new NotFoundError("Media file not found");
    }

    const storage = getStorageDriver();
    const stream = await storage.getStream(mediaFile.storagePath);

    // Convert node stream to web readable stream for Next.js response
    const webStream = Readable.toWeb(stream as Readable);

    const filename = `${mediaFile.job.shortcode || "media"}_${mediaFile.id.slice(0, 8)}.${mediaFile.fileType === "VIDEO" ? "mp4" : "jpg"}`;

    return new NextResponse(webStream as any, {
      status: 200,
      headers: {
        "Content-Type": mediaFile.mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": mediaFile.sizeBytes > 0 ? mediaFile.sizeBytes.toString() : "",
      },
    });
  } catch (err) {
    const formatted = formatErrorResponse(err);
    return NextResponse.json(formatted, { status: formatted.statusCode });
  }
}
