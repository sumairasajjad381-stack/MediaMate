import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { env } from "../config";
import { UnauthorizedError } from "../errors";

const BCRYPT_SALT_ROUNDS = 12;
const TOKEN_EXPIRY = "7d";
export const AUTH_COOKIE_NAME = "insta_session";

export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
}

/**
 * Hash password securely with bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, BCRYPT_SALT_ROUNDS);
}

/**
 * Compare plain password with stored hash
 */
export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

/**
 * Generate a signed JWT token
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch {
    throw new UnauthorizedError("Invalid or expired session token");
  }
}

/**
 * Extract authenticated user if present in cookies or Authorization header.
 * Returns null if not authenticated (does not throw), enabling guest mode.
 */
export async function getOptionalUser(): Promise<TokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Extract authenticated user or throw UnauthorizedError
 */
export async function getRequiredUser(): Promise<TokenPayload> {
  const user = await getOptionalUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}
