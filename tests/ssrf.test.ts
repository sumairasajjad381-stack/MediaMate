import { describe, it, expect } from "vitest";
import { validateSafeUrl } from "@/lib/validation/ssrf";

describe("SSRF Protection & URL Validation", () => {
  it("should allow legitimate public HTTP/HTTPS URLs", () => {
    expect(validateSafeUrl("https://www.youtube.com/watch?v=123").isValid).toBe(true);
    expect(validateSafeUrl("https://example.com/video.mp4").isValid).toBe(true);
    expect(validateSafeUrl("https://tiktok.com/@user/video/123").isValid).toBe(true);
  });

  it("should block localhost and loopback interfaces", () => {
    expect(validateSafeUrl("http://localhost:3000").isValid).toBe(false);
    expect(validateSafeUrl("http://127.0.0.1/api").isValid).toBe(false);
    expect(validateSafeUrl("http://0.0.0.0:8080").isValid).toBe(false);
  });

  it("should block private IPv4 network ranges", () => {
    expect(validateSafeUrl("http://10.0.0.1/admin").isValid).toBe(false);
    expect(validateSafeUrl("http://172.16.0.5/internal").isValid).toBe(false);
    expect(validateSafeUrl("http://192.168.1.1/router").isValid).toBe(false);
  });

  it("should block cloud provider instance metadata endpoints", () => {
    expect(validateSafeUrl("http://169.254.169.254/latest/meta-data/").isValid).toBe(false);
    expect(validateSafeUrl("http://metadata.google.internal/computeMetadata/v1/").isValid).toBe(false);
  });

  it("should reject unsafe or non-web protocols", () => {
    expect(validateSafeUrl("ftp://files.example.com/video.mp4").isValid).toBe(false);
    expect(validateSafeUrl("file:///etc/passwd").isValid).toBe(false);
    expect(validateSafeUrl("javascript:alert(1)").isValid).toBe(false);
  });

  it("should reject empty or malformed inputs", () => {
    expect(validateSafeUrl("").isValid).toBe(false);
    expect(validateSafeUrl("not-a-valid-url").isValid).toBe(false);
  });
});
