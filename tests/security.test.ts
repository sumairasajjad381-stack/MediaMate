import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signToken, verifyToken } from "@/lib/security/auth";
import { validateInstagramHost, sanitizeText } from "@/lib/security/sanitize";

describe("Security Module", () => {
  describe("Password Hashing & Verification", () => {
    it("should hash password and verify correctly", async () => {
      const password = "StrongPassword123!";
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword("WrongPassword123!", hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe("JWT Token Management", () => {
    it("should sign and verify valid JWT token", () => {
      const payload = {
        userId: "usr_123456",
        email: "test@example.com",
        username: "testuser",
        role: "USER",
      };

      const token = signToken(payload);
      expect(typeof token).toBe("string");

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.username).toBe(payload.username);
    });

    it("should reject tampered token", () => {
      const payload = {
        userId: "usr_123456",
        email: "test@example.com",
        username: "testuser",
        role: "USER",
      };

      const token = signToken(payload);
      const tampered = token.slice(0, -5) + "abcde";

      expect(() => verifyToken(tampered)).toThrow();
    });
  });

  describe("SSRF & Host Validation", () => {
    it("should allow valid Instagram subdomains", () => {
      expect(validateInstagramHost("https://www.instagram.com/p/123/").isValid).toBe(true);
      expect(validateInstagramHost("https://instagram.com/reel/123/").isValid).toBe(true);
      expect(validateInstagramHost("https://m.instagram.com/p/123/").isValid).toBe(true);
    });

    it("should block SSRF attempts", () => {
      expect(validateInstagramHost("http://localhost:8080").isValid).toBe(false);
      expect(validateInstagramHost("http://127.0.0.1/admin").isValid).toBe(false);
      expect(validateInstagramHost("http://169.254.169.254/latest").isValid).toBe(false);
      expect(validateInstagramHost("https://not-instagram.com").isValid).toBe(false);
    });
  });

  describe("XSS Sanitization", () => {
    it("should escape HTML tags and dangerous characters", () => {
      const input = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
      const clean = sanitizeText(input);

      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("</script>");
      expect(clean).toContain("&lt;script&gt;");
    });
  });
});
