import { NextRequest, NextResponse } from "next/server";
import { validateSafeUrl } from "@/lib/validation/ssrf";
import { Readable } from "stream";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mediaUrl = searchParams.get("url");

    if (!mediaUrl) {
      return NextResponse.json({ error: "Missing 'url' query parameter" }, { status: 400 });
    }

    const safeCheck = validateSafeUrl(mediaUrl);
    if (!safeCheck.isValid || !safeCheck.normalizedUrl) {
      return NextResponse.json({ error: safeCheck.error || "Prohibited or unsafe URL" }, { status: 403 });
    }

    // Stream download from remote source
    const remoteResponse = await fetch(safeCheck.normalizedUrl, {
      headers: {
        "User-Agent": "MediaMate/1.0 (+https://mediamate.toolkit)",
      },
    });

    if (!remoteResponse.ok || !remoteResponse.body) {
      return NextResponse.json(
        { error: `Remote server returned HTTP ${remoteResponse.status}` },
        { status: 502 }
      );
    }

    const contentType = remoteResponse.headers.get("content-type") || "application/octet-stream";
    const contentLength = remoteResponse.headers.get("content-length");
    const rawFilename = new URL(safeCheck.normalizedUrl).pathname.split("/").pop() || "downloaded_media";
    const safeFilename = rawFilename.replace(/[^a-zA-Z0-9._-]/g, "_");

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
    };

    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    return new NextResponse(remoteResponse.body as any, {
      status: 200,
      headers,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to stream media download." },
      { status: 500 }
    );
  }
}
