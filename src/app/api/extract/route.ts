import { NextRequest, NextResponse } from "next/server";
import { ExtractRequestSchema } from "@/lib/security/validator";
import { scraper } from "@/lib/extractor/scraper";
import { guestRateLimiter, authRateLimiter } from "@/lib/rate-limiter";
import { getOptionalUser } from "@/lib/security/auth";
import { formatErrorResponse, RateLimitError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const user = await getOptionalUser();

    // Rate limit check
    const limiter = user ? authRateLimiter : guestRateLimiter;
    const rateCheck = limiter.consume(user ? user.userId : ip);
    if (!rateCheck.allowed) {
      throw new RateLimitError();
    }

    const body = await req.json();
    const validated = ExtractRequestSchema.parse(body);

    logger.info("Extracting media metadata", { url: validated.url, ip, userId: user?.userId });
    const metadata = await scraper.extract(validated.url);

    return NextResponse.json({
      success: true,
      data: metadata,
      rateLimitRemaining: rateCheck.remaining,
    });
  } catch (err) {
    const formatted = formatErrorResponse(err);
    logger.warn("Extraction failed", { error: formatted.error });
    return NextResponse.json(formatted, { status: formatted.statusCode });
  }
}
