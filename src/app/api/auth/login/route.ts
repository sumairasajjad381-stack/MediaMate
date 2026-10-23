import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserLoginSchema } from "@/lib/security/validator";
import { verifyPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/security/auth";
import { formatErrorResponse, UnauthorizedError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UserLoginSchema.parse(body);

    const query = validated.emailOrUsername.toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: query },
          { username: query },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email/username or password.");
    }

    const isValid = await verifyPassword(validated.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError("Invalid email/username or password.");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    const formatted = formatErrorResponse(err);
    return NextResponse.json(formatted, { status: formatted.statusCode });
  }
}
