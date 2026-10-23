import { z } from "zod";

/**
 * Zod Input Validation Schemas
 * Comprehensive runtime validation for zero-trust API boundaries.
 */

export const ExtractRequestSchema = z.object({
  url: z
    .string()
    .min(1, "Instagram URL is required")
    .url("Must be a valid URL")
    .max(2048, "URL is too long"),
});

export const ArchiveRequestSchema = z.object({
  url: z
    .string()
    .min(1, "Instagram URL is required")
    .url("Must be a valid URL")
    .max(2048, "URL is too long"),
  collectionId: z.string().uuid().optional(),
});

export const UserRegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const UserLoginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const BatchDownloadSchema = z.object({
  mediaFileIds: z.array(z.string().uuid()).min(1, "At least one media item must be selected").max(50, "Batch limit is 50 items at once"),
});

export type ExtractInput = z.infer<typeof ExtractRequestSchema>;
export type ArchiveInput = z.infer<typeof ArchiveRequestSchema>;
export type UserRegisterInput = z.infer<typeof UserRegisterSchema>;
export type UserLoginInput = z.infer<typeof UserLoginSchema>;
export type BatchDownloadInput = z.infer<typeof BatchDownloadSchema>;
