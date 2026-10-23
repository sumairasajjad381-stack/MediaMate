import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UserRegisterSchema } from "@/lib/security/validator";
import { hashPassword, signToken, AUTH_COOKIE_NAME } from "@/lib/security/auth";
import { formatErrorResponse, ValidationError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = UserRegisterSchema.parse(body);

    // Check if email or username already taken
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.email.toLowerCase() },
          { username: validated.username.toLowerCase() },
        ],
      },
    });

    if (existing) {
      if (existing.email.toLowerCase() === validated.email.toLowerCase()) {
        throw new ValidationError("An account with this email already exists.");
      }
      throw new ValidationError("Username is already taken.");
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
      data: {
        username: validated.username.toLowerCase(),
        email: validated.email.toLowerCase(),
        passwordHash,
      },
    });

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

    // Set secure HTTP-only cookie
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    const formatted = formatErrorResponse(err);
    return NextResponse.json(formatted, { status: formatted.statusCode });
  }
}
