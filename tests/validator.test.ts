import { describe, it, expect } from "vitest";
import {
  ExtractRequestSchema,
  UserRegisterSchema,
  UserLoginSchema,
  BatchDownloadSchema,
} from "@/lib/security/validator";

describe("Validation Schemas", () => {
  describe("ExtractRequestSchema", () => {
    it("should accept valid URL", () => {
      const res = ExtractRequestSchema.safeParse({
        url: "https://www.instagram.com/reel/C6xyz123abc/",
      });
      expect(res.success).toBe(true);
    });

    it("should reject non-url", () => {
      const res = ExtractRequestSchema.safeParse({ url: "not-a-url" });
      expect(res.success).toBe(false);
    });
  });

  describe("UserRegisterSchema", () => {
    it("should accept valid registration details", () => {
      const res = UserRegisterSchema.safeParse({
        username: "valid_user-1",
        email: "user@example.com",
        password: "ValidPassword123",
      });
      expect(res.success).toBe(true);
    });

    it("should reject weak password without uppercase or digits", () => {
      const res = UserRegisterSchema.safeParse({
        username: "validuser",
        email: "user@example.com",
        password: "weakpassword",
      });
      expect(res.success).toBe(false);
    });

    it("should reject invalid username characters", () => {
      const res = UserRegisterSchema.safeParse({
        username: "bad user name!",
        email: "user@example.com",
        password: "ValidPassword123",
      });
      expect(res.success).toBe(false);
    });
  });

  describe("BatchDownloadSchema", () => {
    it("should accept list of valid UUIDs", () => {
      const res = BatchDownloadSchema.safeParse({
        mediaFileIds: [
          "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
          "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        ],
      });
      expect(res.success).toBe(true);
    });

    it("should reject empty array", () => {
      const res = BatchDownloadSchema.safeParse({ mediaFileIds: [] });
      expect(res.success).toBe(false);
    });
  });
});
