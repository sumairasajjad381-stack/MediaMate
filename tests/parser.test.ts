import { describe, it, expect } from "vitest";
import { parseInstagramUrl } from "@/lib/extractor/parser";
import { ValidationError } from "@/lib/errors";

describe("Instagram URL Parser", () => {
  it("should successfully parse standard post URLs", () => {
    const url = "https://www.instagram.com/p/C6xyz123abc/";
    const result = parseInstagramUrl(url);

    expect(result.mediaType).toBe("POST");
    expect(result.shortcode).toBe("C6xyz123abc");
    expect(result.cleanUrl).toBe("https://www.instagram.com/p/C6xyz123abc/");
  });

  it("should strip query tracking parameters", () => {
    const url = "https://instagram.com/p/C6xyz123abc/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==";
    const result = parseInstagramUrl(url);

    expect(result.shortcode).toBe("C6xyz123abc");
    expect(result.cleanUrl).toBe("https://www.instagram.com/p/C6xyz123abc/");
  });

  it("should successfully parse reel URLs", () => {
    const url = "https://www.instagram.com/reel/C8abc789def/";
    const result = parseInstagramUrl(url);

    expect(result.mediaType).toBe("REEL");
    expect(result.shortcode).toBe("C8abc789def");
  });

  it("should successfully parse /reels/ plural format", () => {
    const url = "https://www.instagram.com/reels/C8abc789def/";
    const result = parseInstagramUrl(url);

    expect(result.mediaType).toBe("REEL");
    expect(result.shortcode).toBe("C8abc789def");
  });

  it("should parse story URLs with username and storyId", () => {
    const url = "https://www.instagram.com/stories/johndoe/335566778899/";
    const result = parseInstagramUrl(url);

    expect(result.mediaType).toBe("STORY");
    expect(result.username).toBe("johndoe");
    expect(result.storyId).toBe("335566778899");
  });

  it("should reject malicious non-Instagram domains (Anti-SSRF)", () => {
    const maliciousUrls = [
      "https://attacker.com/p/C6xyz123abc/",
      "https://instagram.com.evil.com/p/C6xyz123abc/",
      "http://169.254.169.254/latest/meta-data/",
      "http://localhost:3000/api/extract",
    ];

    for (const url of maliciousUrls) {
      expect(() => parseInstagramUrl(url)).toThrowError(ValidationError);
    }
  });

  it("should reject invalid protocols", () => {
    expect(() => parseInstagramUrl("ftp://instagram.com/p/123/")).toThrowError(ValidationError);
    expect(() => parseInstagramUrl("javascript:alert(1)")).toThrowError(ValidationError);
  });
});
