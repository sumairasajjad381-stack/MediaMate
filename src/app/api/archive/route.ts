import { NextRequest, NextResponse } from "next/server";
import { ArchiveRequestSchema } from "@/lib/security/validator";
import { scraper } from "@/lib/extractor/scraper";
import { downloader } from "@/lib/extractor/downloader";
import { guestRateLimiter, authRateLimiter } from "@/lib/rate-limiter";
import { getOptionalUser } from "@/lib/security/auth";
import { formatErrorResponse, RateLimitError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const user = await getOptionalUser();

    // Rate limiting
    const limiter = user ? authRateLimiter : guestRateLimiter;
    const rateCheck = limiter.consume(user ? user.userId : ip);
    if (!rateCheck.allowed) {
      throw new RateLimitError();
    }

    const body = await req.json();
    const validated = ArchiveRequestSchema.parse(body);

    logger.info("Archiving media", { url: validated.url, userId: user?.userId, ip });

    // Step 1: Scrape metadata
    const metadata = await scraper.extract(validated.url);

    // Step 2: Download and archive media streams
    const result = await downloader.processAndArchive(
      metadata,
      user?.userId,
      ip
    );

    return NextResponse.json({
      success: true,
      data: {
        jobId: result.jobId,
        metadata,
        files: result.files,
      },
    });
  } catch (err) {
    const formatted = formatErrorResponse(err);
    logger.error("Archival failed", err, { formatted });
    return NextResponse.json(formatted, { status: formatted.statusCode });
  }
}
