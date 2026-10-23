import { describe, it, expect } from "vitest";
import { detectPlatform, inspectUrl } from "@/lib/platforms";

describe("Platform Adapter Registry & Detection", () => {
  it("should detect direct media files", () => {
    const adapter = detectPlatform("https://example.com/assets/sample.mp4");
    expect(adapter?.platform).toBe("direct");
  });

  it("should detect YouTube variations", () => {
    expect(detectPlatform("https://www.youtube.com/watch?v=dQw4w9WgXcQ")?.platform).toBe("youtube");
    expect(detectPlatform("https://youtu.be/dQw4w9WgXcQ")?.platform).toBe("youtube");
    expect(detectPlatform("https://www.youtube.com/shorts/123456")?.platform).toBe("youtube");
  });

  it("should detect TikTok URLs", () => {
    expect(detectPlatform("https://www.tiktok.com/@creator/video/123456789")?.platform).toBe("tiktok");
  });

  it("should handle Instagram URLs with ethical fallback when API is restricted", async () => {
    const result = await inspectUrl("https://www.instagram.com/reel/xxx/");
    expect(result.platform).toBe("instagram");
    expect(result.isSupported).toBe(true);
    expect(result.title).toContain("Valid Instagram");
    expect(result.limitationsNotice).toContain("Instagram requires login to preview");
  });

  it("should handle Facebook Reels with ethical fallback", async () => {
    const result = await inspectUrl("https://www.facebook.com/reel/1025252600137666");
    expect(result.platform).toBe("facebook");
    expect(result.isSupported).toBe(true);
    expect(result.title).toContain("Valid Facebook Reel");
    expect(result.limitationsNotice).toContain("Facebook requires login to preview");
  });

  it("should handle unsupported platforms honestly", async () => {
    const result = await inspectUrl("https://www.pinterest.com/pin/123456789/");
    expect(result.platform).toBe("pinterest");
    expect(result.isSupported).toBe(false);
    expect(result.limitationsNotice).toBeDefined();
    expect(result.supportedActions).toEqual([]);
  });

  it("should return clean error for unrecognized random URL", async () => {
    const result = await inspectUrl("https://some-random-unknown-site.xyz/page");
    expect(result.isSupported).toBe(false);
    expect(result.error).toContain("does not match any currently supported platforms");
  });
});
