import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOptionalUser } from "@/lib/security/auth";
import { formatErrorResponse } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (page - 1) * limit;

    const user = await getOptionalUser();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // Where filter: user jobs or guest IP jobs
    const whereClause = user
      ? { userId: user.userId }
      : { ipAddress: ip, userId: null };

    const [total, jobs] = await Promise.all([
      prisma.downloadJob.count({ where: whereClause }),
      prisma.downloadJob.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          files: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    const formatted = formatErrorResponse(err);
    return NextResponse.json(formatted, { status: formatted.statusCode });
  }
}
