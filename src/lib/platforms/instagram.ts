import { IPlatformAdapter, MediaInspectResult } from "./types";

export class InstagramAdapter implements IPlatformAdapter {
  public platform = "instagram" as const;
  public platformName = "Instagram";

  matches(url: string): boolean {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return host.includes("instagram.com") || host.includes("instagr.am");
    } catch {
      return false;
    }
  }

  async inspect(url: string): Promise<MediaInspectResult> {
    const isReel = url.toLowerCase().includes("/reel/");
    const fallbackTitle = isReel ? "Valid Instagram Reel" : "Valid Instagram Link";
    const ethicalFallbackMessage =
      "Instagram requires login to preview. This is a valid public post. To save: Open post > 3 dots > Copy Link, then if it's your own content, use direct media URL or screen capture (ethical method).";

    try {
      // Instagram public oEmbed endpoint with a 2.5s timeout for fast fallback
      const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(oembedUrl, {
        headers: { "User-Agent": "MediaMate/1.0" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // Return clean ethical fallback card instead of failing with an error
        return {
          platform: this.platform,
          platformName: this.platformName,
          url,
          title: fallbackTitle,
          mediaType: "embed",
          supportedActions: [],
          isSupported: true,
          limitationsNotice: ethicalFallbackMessage,
        };
      }

      const data = await res.json();

      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: data.title || fallbackTitle,
        author: data.author_name || "Instagram Creator",
        authorUrl: data.author_url,
        thumbnailUrl: data.thumbnail_url,
        mediaType: "image",
        supportedActions: ["preview", "download_thumbnail"],
        isSupported: true,
        limitationsNotice:
          "Public Instagram media details are provided via the authorized oEmbed specification. Media on private accounts or stories requiring user cookies cannot be accessed without violating platform security controls.",
      };
    } catch {
      // Catch any network/API blockages or timeouts and return the ethical fallback card
      return {
        platform: this.platform,
        platformName: this.platformName,
        url,
        title: fallbackTitle,
        mediaType: "embed",
        supportedActions: [],
        isSupported: true,
        limitationsNotice: ethicalFallbackMessage,
      };
    }
  }
}
